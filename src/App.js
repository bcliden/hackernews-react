import React, { Component } from "react";
import axios from "axios";

import {
  PATH_BASE,
  PATH_SEARCH,
  DEFAULT_QUERY,
  DEFAULT_HPP,
  DEFAULT_TAGS,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
  PARAM_TAGS
} from "./constants";
import Table from "./components/Table";
import Button from "./components/Button";
import Search from "./components/Search";
import { withError, withLoading } from "./components/HOCs";
import { updateSearchTopStoriesState } from "./utils";
import "./App.css";

// HOCs
const ButtonWithLoading = withLoading(Button);
const TableWithError = withError(Table);

class App extends Component {
  state = {
    results: null,
    searchKey: "",
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false
  };

  source = axios.CancelToken.source();

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_TAGS}${DEFAULT_TAGS}`,
        { cancelToken: this.source.token }
      )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          this.setState({ error, isLoading: false });
        }
      });
  };

  setSearchTopStories = result => {
    const { hits, page } = result;

    // give setState a func here to avoid stale state
    this.setState(updateSearchTopStoriesState(hits, page));
  };

  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

  onSearchSubmit = e => {
    e.preventDefault();

    // func used here to avoid getting stale state
    this.setState(prevState => {
      const { searchTerm } = prevState;
      if (this.needsToSearchTopStories(searchTerm)) {
        this.fetchSearchTopStories(searchTerm);
      }
      return { searchKey: searchTerm };
    });
  };

  onDismiss = id => {
    // func used here to avoid getting stale state
    this.setState(prevState => {
      const { searchKey, results } = prevState;
      const { hits, page } = results[searchKey];

      const updatedHits = hits.filter(item => {
        return item.objectID !== id;
      });

      return {
        results: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        }
      };
    });
  };

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { searchTerm, searchKey, results, error, isLoading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        <TableWithError error={error} list={list} onDismiss={this.onDismiss} />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    // cancel axios requests
    this.source.cancel("Component unmounting.");
  }
}

export default App;
