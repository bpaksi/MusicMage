import { applyMiddleware } from "redux";
import action from "./action";
import logger from "./logger";
import webSocketErrors from "./webSocketErrors";
import webSocketReconnect from "./webSocketReconnect";

import webSocketResultToAction from "./webSocketResultToAction";

import * as actions from '../actions'

export default applyMiddleware(
  webSocketErrors(),
	webSocketReconnect(),
	webSocketResultToAction(actions),
  action(),
  logger()
);
