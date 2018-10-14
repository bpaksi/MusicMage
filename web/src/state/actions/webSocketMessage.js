import * as album from "./album";
import * as artist from "./artist";

const handlers = [album, artist];

export const webSocketCallbacks = {
  nextId: 1,
  callbacks: [],
  register: function(callback) {
    const id = "callback_" + this.nextId++;
    this.callbacks.push({ id: id, callback });
    return id;
  },

  pop: function(id) {
    const index = this.callbacks.findIndex(i => i.id === id);
    console.assert(index >= 0, "Unable to find callback", { id, data: this });

    if (index < 0) return null;

    const callback = this.callbacks[index].callback;
    this.callbacks = [
      this.callbacks.slice(0, index),
      ...this.callbacks.slice(index + 1)
    ];

    return callback;
  }
};

export const onWebSocketMessage = dispatch => e => {
  try {
    const message = JSON.parse(e.data);

    const callbackKey = message.returnKey;
    if (callbackKey === undefined || callbackKey <= 0) {
      const funcName = camelize(message.type.replace("_", " ").toLowerCase());

      for (var i = 0; i < handlers.length; i++) {
        if (handlers[i][funcName]) {
          return dispatch(handlers[i][funcName](message.payload));
        }
      }

      return dispatch(webSocketMessage(message));
    } else {
      const callback = webSocketCallbacks.pop(callbackKey);
      if (callback) {
        callback(message.payload);
      } else {
        dispatch(
          webSocketMsgError(message, "Unable to find callback function")
        );
      }
    }
  } catch (err) {
    dispatch(
      webSocketMsgError(e.data, "Error processing websocket message: " + err)
    );
  }
};

export const webSocketMessage = data => ({
  type: "webSocketMessage",
  parameters: { data }
});

export const webSocketMsgError = (data, error) => ({
  type: "webSocketMsgError",
  parameters: { data, error }
});

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}
