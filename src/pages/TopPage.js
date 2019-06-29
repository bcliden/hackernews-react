import React, { Component } from "react";
import axios from "axios";
import { updateTopStoriesState } from "../utils";

import {
  PATH_BASE,
  PATH_SEARCH,
  DEFAULT_HPP,
  PARAM_PAGE,
  PARAM_HPP,
  PARAM_TAGS
} from "../constants";

import Table from "../components/Table";
import Button from "../components/Button";
import { withError, withLoading } from "../components/HOCs";

//HOCs
const TableWithError = withError(Table);
const ButtonWithLoading = withLoading(Button);

export class TopPage extends Component {
  state = {
    results: null,
    error: null,
    isLoading: false
  };

  source = axios.CancelToken.source();

  fetchTopStories = (page = 0) => {
    this.setState({ isLoading: true });

    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_TAGS}front_page`,
        { cancelToken: this.source.token }
      )
      .then(result => this.setTopStories(result.data))
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          this.setState({ error, isLoading: false });
        }
      });
  };

  setTopStories = result => {
    const { hits, page } = result;

    // give setState a func here to avoid stale state
    this.setState(updateTopStoriesState(hits, page));
  };

  onDismiss = id => {
    // func used here to avoid getting stale state
    this.setState(prevState => {
      const { hits, page } = prevState.results;

      const updatedHits = hits.filter(item => {
        return item.objectID !== id;
      });

      return {
        results: {
          hits: updatedHits,
          page
        }
      };
    });
  };

  render() {
    const { results, error, isLoading } = this.state;
    const page = (results && results.page) || 0;
    const list = (results && results.hits) || [];
    return (
      <div className="page">
        <TableWithError error={error} list={list} onDismiss={this.onDismiss} />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchTopStories(page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // const { searchTerm } = this.state;
    // this.setState({ searchKey: searchTerm });
    this.fetchTopStories();
  }

  componentWillUnmount() {
    // cancel axios requests
    this.source.cancel("Component unmounting.");
  }
}

export default TopPage;
