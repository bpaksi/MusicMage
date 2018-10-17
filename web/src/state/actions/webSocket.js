import { notifySuccess, notifyError } from "./notify";
import { navigateRefresh } from "./navigation";

import * as album from "./album";
import * as artist from "./artist";

const handlers = [album, artist];
const scope = "webSocket";

export const webSocketConnect = url => ({
  type: "webSocketConnect",
  parameters: { url },
  scope,
  reduce: () => ({ url }),
  afterReduce: ({ dispatch }) => {
    try {
      const socket = new WebSocket(url);
      socket.onopen = () => dispatch(webSocketConnected());
      socket.onclose = () => dispatch(webSocketDisconnected());
      socket.onmessage = e => dispatch(webSocketMessage(e.data));
      // socket.onerror = (err) => dispatch(webSocketMsgError("Web Socket error occured", err ));

      dispatch(webSocketConnecting(socket));
    } catch (err) {
      dispatch(notifyError("Error connecting to Web Socket.", err));
    }
  }
});

const webSocketConnecting = socket => ({
  type: "webSocketConnecting",
  scope,
  reduce: () => ({ socket })
});

const webSocketConnected = () => ({
  type: "webSocketConnected",
  scope,
  beforeReduce: ({ getState, dispatch }) => {
    const webSocket = getState();

    if (webSocket.reconnect) {
      dispatch(notifySuccess("Server connected"));
      dispatch(navigateRefresh());
    }
  },
  reduce: () => ({ reconnect: false })
});

export const webSocketDisconnect = () => ({
  type: "webSocketDisconnect",
  scope,
  reduce: () => ({ forceExit: true }),
  afterReduce: ({ getState, dispatch }) => {
    try {
      const webSocket = getState();

      webSocket.socket.close();
    } catch (err) {
      dispatch(notifyError("Web Socket error while closing", err));
    }
  }
});

const webSocketDisconnected = () => ({
  type: "webSocketDisconnected",
  scope,
  reduce: state => ({
    socket: null,
    reconnect: !state.forceExit
  }),
  afterReduce: ({ getState, dispatch }) => {
    const webSocket = getState();
    if (!webSocket.forceExit) {
      dispatch(notifyError("Lost server connection!"));

      setTimeout(() => dispatch(webSocketConnect(webSocket.url)), 5000);
    }
  }
});

export const webSocketSend = (payload, serverCallback) => {
  if (serverCallback) {
    payload.returnKey = "%" + new Date().getTime() + "%";
  }

  return {
    type: "webSocketSend",
    scope,
    parameters: { payload, serverCallback },
    reduce: state => {
      if (payload.returnKey) {
        const callbacks = [
          ...state.callbacks,
          { key: payload.returnKey, callback: serverCallback }
        ];

        return { callbacks };
      }
    },
    afterReduce: ({ getState, dispatch }) => {
      sendOnConnect(getState, dispatch, payload);
    }
  };
};

const webSocketMessage = data => ({
  type: "webSocketMessage",
  scope,
  parameters: { data },
  beforeReduce: ({ getState, dispatch }) => {
    var continueWithMsg = true;
    var message;
    try {
      message = JSON.parse(data);
    } catch (err) {
      dispatch(notifyError("Error parsing message: " + err, data));
      return false;
    }

    if (message.returnKey) {
      const webSocket = getState();
      const index = webSocket.callbacks.findIndex(
        i => i.key === message.returnKey
      );
      if (index >= 0) {
        const { callback } = webSocket.callbacks[index];
        dispatch(webSocketCallback(message, callback));
        continueWithMsg = false;
      }
    }

    const funcName = camelize(message.type.replace("_", " ").toLowerCase());
    for (var i = 0; i < handlers.length; i++) {
      if (handlers[i][funcName]) {
        dispatch(handlers[i][funcName](message.payload));
        continueWithMsg = false;
      }
    }

    if (!continueWithMsg) return false;

    return { parameters: { data, parsed: message } };
  }
});

const webSocketCallback = (message, callback) => ({
  type: "webSocketCallback",
  parameters: { message, callback },
  scope,
  reduce: state => {
    console.assert(message.returnKey, "Expected returnKey");
    const idx = state.callbacks.findIndex(i => i.key === message.returnKey);

    if (idx >= 0) {
      const callbacks = [
        ...state.callbacks.splice(0, idx),
        ...state.callbacks.splice(idx + 1)
      ];

      return { callbacks };
    }
  },
  afterReduce: () => {
    callback(message.payload);
  }
});

const sendOnConnect = (getState, dispatch, payload, retrycount) => {
  const webSocket = getState();
  if (webSocket.socket.readyState === 1) {
    try {
      const message = JSON.stringify(payload);
      webSocket.socket.send(message);
    } catch (err) {
      dispatch(notifyError("Error sending message", { err, payload }));
    }

    return;
  }

  retrycount = retrycount || 1;
  if (retrycount > 1000) {
    dispatch(notifyError("Message unsuccessfully sent", payload));
    return;
  }
  // wait 5 milisecond for the connection...
  setTimeout(function() {
    sendOnConnect(getState, payload, retrycount + 1);
  }, 5);
};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}
