import { webSocketConnect } from "../actions/webSocket";
import { notifySuccess, notifyError } from "../actions/notify";
import { navigateRefresh } from "../actions/navigation";

export default () => {
  var forcedDisconnect = false;
  var attemptingReconnect = false;

  return ({ getState, dispatch }) => next => action => {
    const { type } = action;
    const results = next(action);

    switch (type) {
      case "webSocketDisconnect":
        forcedDisconnect = true;
        break;

      case "webSocketDisconnected":
        if (!forcedDisconnect) {
          const { webSocket } = getState();
          dispatch(notifyError("Lost server connection!"));

          setTimeout(() => {
            attemptingReconnect = true;
            dispatch(webSocketConnect(webSocket.url));
          }, 5000);
        }
        break;

      case "webSocketConnected":
        if (attemptingReconnect) {
          dispatch(notifySuccess("Server connected"));
          dispatch(navigateRefresh());

          attemptingReconnect = false;
        }
        forcedDisconnect = false;
        break;

      default:
        break;
    }

    return results;
  };
};
