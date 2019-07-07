export const updateSearchPageState = (hits, page) => prevState => {
  const { searchKey, results } = prevState;

  // check if there are old hits
  const oldHits =
    results && results[searchKey] ? results[searchKey].hits : [];

  // spread all hits together
  const updatedHits = [...oldHits, ...hits];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page },
    },
    isLoading: false,
  };
};

export const updateTopPageState = results => prevState => {
  const oldResults = prevState.results ? prevState.results : [];
  return {
    isLoading: false,
    results: [...oldResults, ...results],
  };
};

export const dismissStoryFromTopPageState = id => prevState => {
  const updatedResults = prevState.results.filter(item => {
    return item.objectID !== id; // cast to Number b/c the data obj is a number
  });

  return {
    results: [...updatedResults],
  };
};

export const dismissStoryFromSearchPageState = id => prevState => {
  const { searchKey, results } = prevState;
  const { hits, page } = results[searchKey];

  const updatedHits = hits.filter(item => {
    return item.objectID !== id;
  });

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page },
    },
  };
};
