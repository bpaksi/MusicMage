import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import middleware from "./middleware"
import reducer from "./reducers";

const composeEnhancers = composeWithDevTools({});

export default createStore(reducer, composeEnhancers(middleware));
