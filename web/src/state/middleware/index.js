import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import action from "./action";
import logger from "./logger";

export default applyMiddleware(thunk, action, logger);