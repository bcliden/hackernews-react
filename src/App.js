import React, { Component } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { TopPage, SearchPage } from './pages';
import './App.css';
import Header from './components/Layout/Header';
import {
  PATH_BASE,
  PATH_SEARCH,
  DEFAULT_QUERY,
  DEFAULT_HPP,
  DEFAULT_TAGS,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
  PARAM_TAGS,
  FRONT_PAGE_BASE,
  FRONT_PAGE_STORIES,
  FRONT_PAGE_ITEM,
} from './constants';
import {
  updateSearchPageState,
  updateTopPageState,
  dismissStoryFromSearchPageState,
  dismissStoryFromTopPageState,
} from './utils';

const links = ['top', 'search'];

class App extends Component {
  state = {
    searchResults: [],
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    topPage: 0,
    topIndex: [],
    topResults: [],
    error: null,
    isLoading: false,
  };

  fetchSearchStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_TAGS}${DEFAULT_TAGS}`,
      )
      .then(result => this.setSearchStories(result.data))
      .catch(error => {
        this.setState({ error, isLoading: false });
      });
  };

  setSearchStories = result => {
    const { hits, page } = result;

    // give setState a func here to avoid stale state
    this.setState(updateSearchPageState(hits, page));
  };

  needsToSearchStories = searchTerm =>
    !this.state.searchResults[searchTerm];

  onSearchSubmit = e => {
    e.preventDefault();

    // func used here to avoid getting stale state
    this.setState(prevState => {
      const { searchTerm } = prevState;
      if (this.needsToSearchStories(searchTerm)) {
        this.fetchSearchStories(searchTerm);
      }
      return { searchKey: searchTerm };
    });
  };

  onSearchDismiss = id => {
    this.setState(dismissStoryFromSearchPageState(id));
  };

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  onSearchKeyChange = searchTerm => {
    this.setState({ searchKey: searchTerm });
  };

  fetchTopStoriesIndex = async () => {
    // grab indexes of top stories, save for later.
    // just ids, generally 350-400 of them
    this.setState({ isLoading: true });

    const response = await axios.get(
      `${FRONT_PAGE_BASE}${FRONT_PAGE_STORIES}`,
    );
    this.setState({ topIndex: response.data });
  };

  fetchTopStories = async (page = 0) => {
    // hydrate ids from the index cache
    this.setState({ topPage: page, isLoading: true });

    const pageStart = page * 20;
    const pageEnd = pageStart + 20;

    const pageIDs = this.state.topIndex.slice(pageStart, pageEnd);

    const hydratedPosts = await Promise.all(
      pageIDs.map(async id => {
        return await axios.get(
          `${FRONT_PAGE_BASE}${FRONT_PAGE_ITEM}${id}.json`,
        );
      }),
    );

    // convert the FireBase API format to the Algolia format (which Table expects)
    const posts = hydratedPosts.map(res => {
      const post = res.data;
      return {
        ...post,
        author: post.by,
        num_comments: post.descendants,
        points: post.score,
        objectID: String(post.id), // Table expects a string
      };
    });
    this.setTopStories(posts);
  };

  setTopStories = results => {
    // give setState a func here to avoid stale state
    this.setState(updateTopPageState(results));
  };

  onTopDismiss = id => {
    // func used here to avoid getting stale state
    this.setState(dismissStoryFromTopPageState(id));
  };

  render() {
    return (
      <Router>
        <Header links={links}>Hacker News</Header>
        <AnimatePresence>
          <Route exact path="/">
            <Redirect to="/top" />
          </Route>
          <Route
            path="/top"
            render={props => {
              const {
                topResults,
                topPage,
                topIndex,
                error,
                isLoading,
              } = this.state;
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TopPage
                    {...props}
                    results={topResults}
                    page={topPage}
                    error={error}
                    index={topIndex}
                    isLoading={isLoading}
                    onDismiss={this.onTopDismiss}
                    fetchTopStories={this.fetchTopStories}
                    fetchTopStoriesIndex={this.fetchTopStoriesIndex}
                  />
                </motion.div>
              );
            }}
          />
          <Route
            path="/search"
            render={props => {
              const {
                searchKey,
                searchTerm,
                searchResults,
                error,
                isLoading,
              } = this.state;
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SearchPage
                    {...props}
                    results={searchResults}
                    searchKey={searchKey}
                    searchTerm={searchTerm}
                    error={error}
                    isLoading={isLoading}
                    fetchSearchStories={this.fetchSearchStories}
                    setSearchStories={this.setSearchStories}
                    needsToSearchStories={this.needsToSearchStories}
                    onSubmit={this.onSearchSubmit}
                    onDismiss={this.onSearchDismiss}
                    onChange={this.onSearchChange}
                    onSearchKeyChange={this.onSearchKeyChange}
                  />
                </motion.div>
              );
            }}
          />
        </AnimatePresence>
      </Router>
    );
  }
}

export default App;
