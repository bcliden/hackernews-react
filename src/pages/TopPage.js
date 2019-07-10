import React, { Component } from 'react';

import Table from '../components/Table';
import Button from '../components/Button';
import { withError, withLoading } from '../components/HOCs';

//HOCs
const TableWithError = withError(Table);
const ButtonWithLoading = withLoading(Button);

export class TopPage extends Component {
  render() {
    const { results, page, error, isLoading, onDismiss, fetchTopStories } = this.props;
    const list = results || [];
    return (
      <div className="page">
        <TableWithError
          error={error}
          list={list}
          onDismiss={onDismiss}
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => fetchTopStories(page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    const { results, index } = this.props;
    if(index.length === 0 && results.length === 0) {
      await this.props.fetchTopStoriesIndex();
      this.props.fetchTopStories();
    }
  }
}

export default TopPage;
