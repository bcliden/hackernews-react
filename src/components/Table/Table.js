import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

import { SORTS } from '../../constants';
import Row from './Row';
import Sort from './Sort';
import './Table.css';

export class Table extends Component {
  state = {
    sortKey: 'NONE',
    isSortReverse: false,
    width: 0,
  };

  onSort = sortKey => {
    // func used here to avoid getting stale state
    this.setState(prevState => {
      const isSortReverse =
        prevState.sortKey === sortKey && !prevState.isSortReverse;
      return { sortKey, isSortReverse };
    });
  };

  useFallback = (text, iconName, width = 1200) => {
    return this.state.width <= width ? (
      <i className={`fas fa-${iconName}`} />
    ) : (
      text
    );
  };

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span className="largeColumn ">
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Title
            </Sort>
          </span>
          <span className="mediumColumn">
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Author
            </Sort>
          </span>
          <span className="smallColumn">
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {this.useFallback('Comments', 'comment')}
            </Sort>
          </span>
          <span className="smallColumn">
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              {this.useFallback('Points', 'star')}
            </Sort>
          </span>
          <span className="tinyColumn">
            {this.useFallback('Archive', 'archive')}
          </span>
        </div>
        <AnimatePresence>
        {reverseSortedList.map(item => {
          return (
            <motion.div
            // className="table-row"
            key={item.objectID}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            positionTransition
          >
            <Row
              key={item.objectID}
              item={item}
              onDismiss={onDismiss}
            />
          </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
    );
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // prevent table from rerendering on every keystroke
  //   if (
  //     this.props.list === nextProps.list &&
  //     this.state.sortKey === nextState.sortKey &&
  //     this.state.isSortReverse === nextState.isSortReverse
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default Table;
