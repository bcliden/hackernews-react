export const updateSearchPageState = (hits, page) => prevState => {
  const { searchKey, searchResults } = prevState;

  // check if there are old hits
  const oldHits =
    searchResults && searchResults[searchKey] ? searchResults[searchKey].hits : [];

  // spread all hits together
  const updatedHits = [...oldHits, ...hits];

  return {
    searchResults: {
      ...searchResults,
      [searchKey]: { hits: updatedHits, page },
    },
    isLoading: false,
  };
};

export const updateTopPageState = results => prevState => {
  const oldResults = prevState.topResults ? prevState.topResults : [];
  return {
    isLoading: false,
    topResults: [...oldResults, ...results],
  };
};

export const dismissStoryFromTopPageState = id => prevState => {
  const updatedResults = prevState.topResults.filter(item => {
    return item.objectID !== id; // cast to Number b/c the data obj is a number
  });

  return {
    topResults: [...updatedResults],
  };
};

export const dismissStoryFromSearchPageState = id => prevState => {
  const { searchKey, searchResults } = prevState;
  const { hits, page } = searchResults[searchKey];

  const updatedHits = hits.filter(item => {
    return item.objectID !== id;
  });

  return {
    searchResults: {
      ...searchResults,
      [searchKey]: { hits: updatedHits, page },
    },
  };
};
