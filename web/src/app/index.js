import React from "react";
import { Provider } from "react-redux";

import Body from "./body";
import createStore from "../state";

class App extends React.Component {
  state = { store: createStore() };

  render() {
    const { store } = this.state;

    return (
      <Provider store={store}>
        <Body />
      </Provider>
    );
  }
}

export default App;
