import React, { Component } from "react";
import axios from "axios";

import {
  FRONT_PAGE_BASE,
  FRONT_PAGE_STORIES,
  FRONT_PAGE_ITEM
} from "../constants";

import Table from "../components/Table";
import Button from "../components/Button";
import { withError, withLoading } from "../components/HOCs";

//HOCs
const TableWithError = withError(Table);
const ButtonWithLoading = withLoading(Button);

export class TopPage extends Component {
  state = {
    postIndex: [],
    page: 0,
    results: null,
    error: null,
    isLoading: false
  };

  source = axios.CancelToken.source();

  fetchTopStoriesIndexes = async () => {
    this.setState({ isLoading: true });
    const response = await axios.get(
      `${FRONT_PAGE_BASE}${FRONT_PAGE_STORIES}`,
      { cancelToken: this.source.token }
    );
    this.setState({ postIndex: response.data, isLoading: false });
  };

  fetchTopStories = async (page = 0) => {
    this.setState({ isLoading: true, page });
    const pageStart = page * 20;
    const pageEnd = pageStart + 20;

    const ids = this.state.postIndex.slice(pageStart, pageEnd);

    const hydratedPosts = await Promise.all(
      ids.map(async id => {
        return await axios.get(
          `${FRONT_PAGE_BASE}${FRONT_PAGE_ITEM}${id}.json`,
          {
            cancelToken: this.source.token
          }
        );
      })
    );

    const posts = hydratedPosts.map(res => {
      const post = res.data;
      return {
        ...post,
        author: post.by,
        num_comments: post.descendants,
        points: post.score,
        objectID: post.id
      };
    });
    this.setTopStories(posts);
  };

  setTopStories = results => {
    // give setState a func here to avoid stale state
    this.setState(prevState => {
      const oldResults = prevState.results ? prevState.results : [];
      return {
        isLoading: false,
        results: [...oldResults, ...results]
      };
    });
  };

  onDismiss = id => {
    // func used here to avoid getting stale state
    this.setState(prevState => {
      const updatedResults = prevState.results.filter(item => {
        return item.id !== id;
      });

      return {
        results: [...updatedResults]
      };
    });
  };

  render() {
    const { results, page, error, isLoading } = this.state;
    const list = results || [];
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

  async componentDidMount() {
    await this.fetchTopStoriesIndexes();
    this.fetchTopStories();
  }

  componentWillUnmount() {
    // cancel axios requests
    this.source.cancel("Component unmounting.");
  }
}

export default TopPage;
