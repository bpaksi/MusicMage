import { webSocketConnect } from "../actions";
import { notifySuccess, notifyError } from "../actions/notify";
import { navigateRefresh } from "../actions/navigation";

export default () => {
  var url = "";
  var forcedDisconnect = false;
  var attemptingReconnect = false;

  return ({ dispatch }) => next => action => {
    const { type, parameters } = action;
    const results = next(action);

    switch (type) {
      case "webSocketConnect":
        url = parameters.url;
        break;

      case "webSocketConnected":
        if (attemptingReconnect) {
          dispatch(notifySuccess("Server connected"));
          dispatch(navigateRefresh());

          attemptingReconnect = false;
        }
        forcedDisconnect = false;
        break;

      case "webSocketDisconnect":
        forcedDisconnect = true;
        break;

      case "webSocketDisconnected":
        if (!forcedDisconnect) {
          dispatch(notifyError("Lost server connection!"));

          setTimeout(() => {
            attemptingReconnect = true;
            dispatch(webSocketConnect(url));
          }, 5000);
        }
        break;

      default:
        break;
    }

    return results;
  };
};
