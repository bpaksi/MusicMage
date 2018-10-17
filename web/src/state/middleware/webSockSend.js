import { webSocketSend } from "../actions/webSocket";

export default () => {
  var callbacks = [];

  return ({ getState, dispatch }) => next => action => {
    const { type, webSocketSend: payload, webSocketResults: callback } = action;

    if (payload && isFunction(callback)) {
      payload.returnKey = "%" + new Date().getTime() + "%";

			callbacks = [...callbacks, { key: payload.returnKey, callback }];
			

			console.log("webSocketSend 1", {payload, callbacks})
    }

    if (type === "webSocketMessage") {


			const { returnKey, payload } = action.parameters.message;

      if (returnKey) {
				console.log("webSocketSend 2", {action})



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

    const results = next(action);

    if (payload) {
      dispatch(webSocketSend(payload));
    }

    return results;
  };
};

const isFunction = obj => typeof obj === "function";
