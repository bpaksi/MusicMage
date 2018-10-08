import { NotifyStatuses } from "./notify";

export const webSocketConnect = url => (dispatch, getState) => {
  const { webSocket } = getState();
  if (webSocket.manualExit) {
    return;
  }

  const socket = new WebSocket(url);
  socket.onopen = () => dispatch(webSocketConnected());
  socket.onclose = () => {
    console.log("onclose: ");

    dispatch(webSocketDisconnected());

    // attempt restart
    const { webSocket } = getState();
    if (!webSocket.manualExit && webSocket.attemptRestart) {
      setTimeout(() => dispatch(webSocketConnect(webSocket.url)), 5000);
    }
  };
  socket.onmessage = e => {
    try {
      const message = JSON.parse(e.data);
      dispatch(webSocketMessage(message));
    } catch (err) {
      dispatch(webSocketMsgError(e.data, err));
    }
  };

  dispatch(webSocketConnecting(url, socket));
};

export const webSocketConnecting = (url, socket) => ({
  type: "webSocketConnecting",
  reduce: state => ({ webSocket: { ...state.webSocket, url, socket } })
});

export const webSocketConnected = () => ({
  type: "webSocketConnected",
  reduce: state => ({
    webSocket: { ...state.webSocket, open: true },
    notify: {
      ...state.notify,
      open: true,
      message: "Server connected",
      status: NotifyStatuses.SUCCESS
    }
  })
});

export const webSocketDisconnect = () => (dispatch, getState) => {
  const { webSocket } = getState();
  webSocket.socket.close();

  dispatch(webSocketDisconnecting());
};

export const webSocketDisconnecting = () => ({
  type: "webSocketDisconnecting",
  reduce: state => ({
    webSocket: { ...state.webSocket, manualExit: true }
  })
});

export const webSocketDisconnected = () => ({
  type: "webSocketDisconnected",
  reduce: state => ({
    webSocket: { ...state.webSocket, open: false, socket: null },
    notify: {
      ...state.notify,
      open: true,
      message: "Lost server connection!",
      status: NotifyStatuses.ERROR
    }
  })
});

export const webSocketMsgError = (data, error) => ({
  type: "webSocketMsgError",
  parameters: { data, error }
});

export const webSocketMessage = data => ({
  type: "webSocketMessage",
  parameters: { data }
});

export const webSocketSend = payload => (dispatch, getState) => {
  sendOnConnect(getState, payload, () => {
    dispatch(webSocketSent());
  });
};

export const webSocketSent = payload => ({
  type: "webSocketSent",
  parameters: { payload }
});

const sendOnConnect = (getState, payload, callback, retrycount) => {
  const { webSocket } = getState();
  if (webSocket.open) {
    webSocket.socket.send(JSON.stringify(payload));

    if (callback) {
      callback();
    }
    return;
  }

  retrycount = retrycount ? retrycount : 1;
  if (retrycount > 1000) {
    console.error("Message unsuccessfully sent", payload);
    return;
  }
  // wait 5 milisecond for the connection...
  setTimeout(function() {
    sendOnConnect(getState, payload, callback, retrycount + 1);
  }, 5);
};
