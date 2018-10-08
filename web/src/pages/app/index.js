import React from "react";
import { Provider } from "react-redux";
import store from "../../state";
import Container from "./container";

export default () => (
  <Provider store={store}>
    <Container />
  </Provider>
);
