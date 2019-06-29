import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { TopPage, SearchPage } from "./pages";
import "./App.css";
import Header from "./components/Layout/Header";

const links = ["top", "search"];

class App extends Component {
  render() {
    return (
      <Router>
        <Header links={links}>Hacker News</Header>
        <Route exact path="/">
          <Redirect to="/top" />
        </Route>
        <Route path="/top" component={TopPage} />
        <Route path="/search" component={SearchPage} />
      </Router>
    );
  }
}

export default App;
