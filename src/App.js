import React, { Component } from "react";
import axios from "axios";
import { sortBy } from "lodash";
import PropTypes from "prop-types";
import "./App.css";

// url constants
const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "20";
const DEFAULT_TAGS = "story";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";
const PARAM_TAGS = "tags=";

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title"),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, "num_comments").reverse(),
  POINTS: list => sortBy(list, "points").reverse()
};

// styles
const largeColumn = {
  width: "40%"
};

const mediumColumn = {
  width: "30%"
};

const smallColumn = {
  width: "10%"
};

class App extends Component {
  state = {
    results: null,
    searchKey: "",
    searchTerm: DEFAULT_QUERY,
    error: null,
    isLoading: false,
    sortKey: "NONE"
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
          this.setState({ error });
        }
      });
  };

  setSearchTopStories = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    // check if there are old hits
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    // spread all hits together
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
  };

  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

  onSearchSubmit = e => {
    e.preventDefault();
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
  };

  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const updatedHits = hits.filter(item => {
      return item.objectID !== id;
    });

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  };

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  onSort = sortKey => {
    this.setState({ sortKey });
  };

  render() {
    const {
      searchTerm,
      searchKey,
      sortKey,
      results,
      error,
      isLoading
    } = this.state;
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
        {/* {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )} */}
        <TableWithError
          error={error}
          list={list}
          sortKey={sortKey}
          onSort={this.onSort}
          onDismiss={this.onDismiss}
        />
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

class Search extends Component {
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={el => (this.input = el)}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node
};

class Table extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // prevent table from rerendering on every keystroke
    if (
      this.props.list === nextProps.list &&
      this.props.sortKey === nextProps.sortKey
    ) {
      return false;
    }
    return true;
  }
  render() {
    const { list, sortKey, onSort, onDismiss } = this.props;
    return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort sortKey={"TITLE"} onSort={onSort}>
              Title
            </Sort>
          </span>
          <span style={mediumColumn}>
            <Sort sortKey={"AUTHOR"} onSort={onSort}>
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort sortKey={"COMMENTS"} onSort={onSort}>
              Comments
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort sortKey={"POINTS"} onSort={onSort}>
              Points
            </Sort>
          </span>
          <span style={smallColumn}>Archive</span>
        </div>
        {SORTS[sortKey](list).map(item => {
          return (
            <div key={item.objectID} className="table-row">
              <span style={largeColumn}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={mediumColumn}>{item.author}</span>
              <span style={smallColumn}>{item.num_comments}</span>
              <span style={smallColumn}>{item.points}</span>
              <span style={smallColumn}>
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  className="button-inline"
                >
                  Dismiss
                </Button>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

const Loading = () => (
  <div className="lds-ripple">
    <div />
    <div />
  </div>
);

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

const withError = Component => ({ error, ...rest }) =>
  error ? (
    <div className="interactions">
      <p>Something went wrong.</p>
    </div>
  ) : (
    <Component {...rest} />
  );

const TableWithError = withError(Table);

const Sort = ({ sortKey, onSort, children }) => (
  <Button onClick={() => onSort(sortKey)} className="button-inline">
    {children}
  </Button>
);

export default App;

export { Button, Search, Table };
