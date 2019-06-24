import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import Body from "./root/body";
import createStore from "../state";

class App extends React.Component {
  state = { store: createStore() };

  render() {
    const { store } = this.state;

    return (
      <Provider store={store}>
        <Router>
          <Body />
        </Router>
      </Provider>
    );
  }
}

export default App;
