export const updateSearchTopStoriesState = (hits, page) => prevState => {
  const { searchKey, results } = prevState;

  // check if there are old hits
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  // spread all hits together
  const updatedHits = [...oldHits, ...hits];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};
