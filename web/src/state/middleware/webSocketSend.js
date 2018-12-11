import { webSocketSend } from "../actions";

export default () => {
  var callbacks = [];

  return ({ getState, dispatch }) => next => action => {
    const { type, webSocketSend: webSocketPayload, webSocketResults: callback } = action;

    if (type === "webSocketMessage") {
      const { returnKey, payload } = action.parameters.message;

      if (returnKey) {
        const index = callbacks.findIndex(i => i.key === returnKey);
        if (index >= 0) {
          callbacks[index].callback({ getState, dispatch, payload });

          callbacks = [
            ...callbacks.splice(0, index),
            ...callbacks.splice(index + 1)
          ];
          return false;
        }
      }
    }

    if (webSocketPayload && isFunction(callback)) {
      webSocketPayload.returnKey = "%" + new Date().getTime() + "%";

			callbacks = [...callbacks, { key: webSocketPayload.returnKey, callback }];
    }

    const results = next(action);

    if (webSocketPayload) {
      dispatch(webSocketSend(webSocketPayload));
    }

    return results;
  };
};

const isFunction = obj => typeof obj === "function";
