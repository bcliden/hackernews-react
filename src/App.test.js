import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App, { Search, Button, Table, updateSearchTopStoriesState } from "./App";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Search", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Search>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Search>Search</Search>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Button", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button>Give Me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<Button>Give Me More</Button>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders child text correctly", () => {
    const element = render(<Button>Give Me More</Button>);

    expect(element.text()).toBe("Give Me More");
  });
});

describe("Table", () => {
  const props = {
    list: [
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
    sortKey: "TITLE",
    isSortReverse: false
  };

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("has a valid snapshot", () => {
    const component = renderer.create(<Table {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows two items in a list", () => {
    const element = shallow(<Table {...props} />);

    expect(element.find(".table-row").length).toBe(2);
  });
});

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
