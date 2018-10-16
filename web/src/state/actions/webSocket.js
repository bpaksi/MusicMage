import { notifySuccess, notifyError } from "./notify";

import * as album from "./album";
import * as artist from "./artist";

const handlers = [album, artist];

export const webSocketConnect = url => ({
  type: "webSocketConnect",
  parameters: { url },
  reduce: state => ({ webSocket: { ...state.webSocket, url } }),
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
  reduce: state => ({ webSocket: { ...state.webSocket, socket } })
});

const webSocketConnected = () => ({
  type: "webSocketConnected",
  afterReduce: ({ dispatch }) => {
    dispatch(notifySuccess("Server connected"));
  }
});

export const webSocketDisconnect = () => ({
  type: "webSocketDisconnect",
  reduce: state => ({
    webSocket: { ...state.webSocket, forceExit: true }
  }),
  afterReduce: ({ getState }) => {
    const { webSocket, dispatch } = getState();

    try {
      webSocket.socket.close();
    } catch (err) {
      dispatch(notifyError("Web Socket error while closing", err));
    }
  }
});

const webSocketDisconnected = () => ({
  type: "webSocketDisconnected",
  reduce: state => ({
    webSocket: { ...state.webSocket, socket: null }
  }),
  afterReduce: ({ getState, dispatch }) => {
    const { webSocket } = getState();
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
    parameters: { payload, serverCallback },
    reduce: state => {
      if (payload.returnKey) {
        const callbacks = [
          ...state.webSocket.callbacks,
          { key: payload.returnKey, callback: serverCallback }
        ];

        return { webSocket: { ...state.webSocket, callbacks } };
      }
    },
    afterReduce: ({ getState, dispatch }) => {
      sendOnConnect(getState, dispatch, payload);
    }
  };
};

const webSocketMessage = data => ({
  type: "webSocketMessage",
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
      const { webSocket } = getState();

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
  reduce: state => {
    console.assert(message.returnKey, "Expected returnKey");
    const webSocket = { ...state.webSocket };
    const idx = webSocket.callbacks.findIndex(i => i.key === message.returnKey);

    if (idx >= 0) {
      webSocket.callbacks = [
        ...webSocket.callbacks.splice(0, idx),
        ...webSocket.callbacks.splice(idx + 1)
      ];

      return { webSocket };
    }
  },
  afterReduce: () => {
    callback(message.payload);
  }
});

const sendOnConnect = (getState, dispatch, payload, retrycount) => {
  const { webSocket } = getState();
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
