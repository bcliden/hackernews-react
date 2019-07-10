import React, { Component } from 'react';

import Table from '../components/Table';
import Button from '../components/Button';
import Search from '../components/Search';
import { withError, withLoading } from '../components/HOCs';

//HOCs
const TableWithError = withError(Table);
const ButtonWithLoading = withLoading(Button);

export class SearchPage extends Component {
  render() {
    const {
      results,
      searchTerm,
      searchKey,
      error,
      isLoading,
      onChange,
      onSubmit,
      onDismiss,
      fetchSearchStories,
    } = this.props;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) ||
      [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={onChange}
            onSubmit={onSubmit}
          >
            Search
          </Search>
        </div>
        <TableWithError
          error={error}
          list={list}
          onDismiss={onDismiss}
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => fetchSearchStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { searchTerm, needsToSearchStories } = this.props;

    this.props.onSearchKeyChange(searchTerm);
    if (needsToSearchStories(searchTerm)) {
      this.props.fetchSearchStories(searchTerm);
    }
  }
}

export default SearchPage;
