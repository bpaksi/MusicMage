import { applyMiddleware } from "redux";
import action from "./action";
import logger from "./logger";
import webSockSend from "./webSockSend";
import webSocketErrors from "./webSocketErrors";
import webSocketReconnect from "./webSocketReconnect";

import webSockResultToAction from "./webSockResultToAction";

import * as album from '../actions/album'
import * as artist from '../actions/artist'


export default applyMiddleware(
  webSockSend(),
  webSocketErrors(),
	webSocketReconnect(),
	webSockResultToAction(album, artist),
  action(),
  logger()
);
