import ActionTypes from "../constants";

var disconnected = false;
var currentSubscription = null;

export default ({ dispatch }) => next => action => {
  if (action.type.endsWith("_SUBSCRIBE")) {
    currentSubscription = action;
  } else if (action.type.endsWith("_UNSUBSCRIBE")) {
    currentSubscription = null;
  } else if (action.type === ActionTypes.WEBSOCKET_DISCONNECTED) {
    disconnected = true;
  } else if (action.type === ActionTypes.WEBSOCKET_CONNECTED &&
    currentSubscription &&
    disconnected) {
    dispatch(currentSubscription);
  }

  return next(action);
};
