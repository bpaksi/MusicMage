import { applyMiddleware } from "redux";
import action from "./action";
import logger from "./logger";
import webSocketErrors from "./webSocketErrors";
import webSocketReconnect from "./webSocketReconnect";

import webSocketResultToAction from "./webSocketResultToAction";

import * as album from '../actions/album'
import * as artist from '../actions/artist'
import * as unassigned from '../actions/unassigned'

export default applyMiddleware(
  webSocketErrors(),
	webSocketReconnect(),
	webSocketResultToAction(album, artist, unassigned),
  action(),
  logger()
);
