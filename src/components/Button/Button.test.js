import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Button from "./Button";
Enzyme.configure({ adapter: new Adapter() });

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
