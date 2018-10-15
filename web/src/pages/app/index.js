import React from "react";
import { Provider } from "react-redux";
import store from "../../state";
import Body from "./body";

export default () => (
  <Provider store={store}>
    <Body />
  </Provider>
);
