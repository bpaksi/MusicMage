import { applyMiddleware } from "redux";
import action from "./action";
import logger from "./logger";

export default applyMiddleware(action, logger);