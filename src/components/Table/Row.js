import React, { Component } from 'react';
import Button from '../Button';
import { COMMENTS_LINK_BASE } from '../../constants';

export class Row extends Component {
  render() {
    const { item, onDismiss } = this.props;
    return (
      <div key={item.objectID} className="table-row">
        <span className="largeColumn">
          <a href={item.url}>{item.title}</a>
        </span>
        <span className="mediumColumn">{item.author}</span>
        <span className="smallColumn">
          <a href={`${COMMENTS_LINK_BASE}${item.objectID}`}>
            {item.num_comments}
          </a>
        </span>
        <span className="smallColumn">{item.points}</span>
        <span className="tinyColumn">
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
            style={{ transform: 'scale(1.6)' }}
          >
            &times;
          </Button>
        </span>
        <span className="smallTagLine">
          by {item.author} | {item.points} points |{' '}
          <a href={`${COMMENTS_LINK_BASE}${item.objectID}`}>
            {item.num_comments || 0}&nbsp;Comments
          </a>
        </span>
      </div>
    );
  }
}

export default Row;
