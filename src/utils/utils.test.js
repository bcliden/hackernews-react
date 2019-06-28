import React from "react";

import { updateSearchTopStoriesState } from "./index";

describe("updateSearchTopStoriesState", () => {
  const results = {
    hits: [
      {
        title: "3",
        author: "3",
        num_comments: 1,
        points: 2,
        objectID: "a"
      },
      {
        title: "4",
        author: "4",
        num_comments: 1,
        points: 2,
        objectID: "b"
      }
    ],
    page: 1
  };

  const prevState = {
    searchKey: "test",
    results: {
      test: {
        hits: [
          {
            title: "1",
            author: "1",
            num_comments: 1,
            points: 2,
            objectID: "y"
          },
          {
            title: "2",
            author: "2",
            num_comments: 1,
            points: 2,
            objectID: "z"
          }
        ],
        page: 0
      }
    }
  };

  it("concatenates new results", () => {
    const { hits, page } = results;
    const newState = updateSearchTopStoriesState(hits, page)(prevState);
    expect(newState.results.test.hits.length).toEqual(4);
  });
});
