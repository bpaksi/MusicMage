import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import middleware from "./middleware"
import reducer from "./reducers";

const enhancers = composeWithDevTools({});

export default () => createStore(reducer, enhancers(middleware));
