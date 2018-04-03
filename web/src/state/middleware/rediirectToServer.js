import ActionTypes from "../constants";

export default store => next => action => {
  if (action.redirectToServer) {
    store.dispatch({
      type: ActionTypes.WEBSOCKET_SEND,
      payload: action,
    });
  }

  return next(action);
};


