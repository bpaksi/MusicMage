// webSocket: {
// 	url: "",
// 	socket: null,
// }

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
      socket.onmessage = e => dispatch(webSocketMessage(JSON.parse(e.data)));
      // socket.onerror = (err) => dispatch(webSocketMsgError("Web Socket error occured", err ));

      dispatch(webSocketConnecting(socket));
    } catch (err) {
      dispatch(webSocketError("Error connecting to Web Socket.", err));
    }
  }
});

const webSocketConnecting = socket => ({
  type: "webSocketConnecting",
  scope,
  reduce: () => ({ socket })
});

const webSocketConnected = () => ({
  type: "webSocketConnected"
});

export const webSocketDisconnect = () => ({
  type: "webSocketDisconnect",
  scope,
  afterReduce: ({ getState, dispatch }) => {
    try {
      const webSocket = getState();

      webSocket.socket.close();
    } catch (err) {
      dispatch(webSocketError("Web Socket error while closing", err));
    }
  }
});

const webSocketDisconnected = () => ({
  type: "webSocketDisconnected",
  scope,
  reduce: () => ({ socket: null })
});

export const webSocketSend = (payload) => {
  return {
    type: "webSocketSend",
    scope,
    parameters: { payload },
    afterReduce: ({ getState, dispatch, action }) => {
      sendOnConnect(getState, dispatch, action.parameters.payload);
    }
  };
};

const webSocketMessage = message => ({
  type: "webSocketMessage",
  scope,
  parameters: { message },
});

const webSocketError = (message, data) => ({
  type: "webSocketError",
  parameters: { message, data }
});

const sendOnConnect = (getState, dispatch, payload, retrycount) => {
  const webSocket = getState();
  if (webSocket.socket.readyState === 1) {
    try {
      const message = JSON.stringify(payload);
      webSocket.socket.send(message);
    } catch (err) {
      dispatch(webSocketError("Error sending message", { err, payload }));
    }

    return;
  }

  retrycount = retrycount || 1;
  if (retrycount > 1000) {
    dispatch(webSocketError("Message unsuccessfully sent", payload));
    return;
  }
  // wait 5 milisecond for the connection...
  setTimeout(function() {
    sendOnConnect(getState, payload, retrycount + 1);
  }, 5);
};
