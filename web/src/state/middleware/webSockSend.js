import { webSocketSend } from "../actions";

export default () => {
  var callbacks = [];

  return ({ getState, dispatch }) => next => action => {
    const { type, webSocketSend: payload, webSocketResults: callback } = action;

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

    if (payload && isFunction(callback)) {
      payload.returnKey = "%" + new Date().getTime() + "%";

			callbacks = [...callbacks, { key: payload.returnKey, callback }];
    }

    const results = next(action);

    if (payload) {
      dispatch(webSocketSend(payload));
    }

    return results;
  };
};

const isFunction = obj => typeof obj === "function";
