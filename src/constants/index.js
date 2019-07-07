import { sortBy } from 'lodash';

// url constants
export const DEFAULT_QUERY = 'redux';
export const DEFAULT_HPP = '20';
export const DEFAULT_TAGS = 'story';

export const PATH_BASE = 'https://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search';
export const COMMENTS_LINK_BASE =
  'https://news.ycombinator.com/item?id=';

export const PARAM_SEARCH = 'query=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = 'hitsPerPage=';
export const PARAM_TAGS = 'tags=';

export const FRONT_PAGE_BASE =
  'https://hacker-news.firebaseio.com/v0/';
export const FRONT_PAGE_ITEM = 'item/';
export const FRONT_PAGE_STORIES = 'topstories.json';

export const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};
