import ActionTypes from '../constants';
import * as actions from '../../state/actions'

var settings = {
  attemptRestart: true,
  open: false,
  exit: false,
  url: "",
  websocket: null,
}

const onOpen = (dispatch) => {
  return () => {
    settings.open = true;

    dispatch(actions.websocketConnected());
  }
}

const onClose = (dispatch) => {
  return (e) => {
    if (settings.open) {
      dispatch(actions.websocketDisconnected(e));
    }

    settings.open = false;
    settings.websocket = null;
    if (!settings.exit && settings.attemptRestart) {
      setTimeout(start(dispatch), 5000);
    }
  }
}

const onMessage = (dispatch) => {
  return (e) => {
    try {
      const message = JSON.parse(e.data);
      dispatch(message);
    }
    catch (err) {
      dispatch(actions.websocketMsgError(e.data, err));
    }
  }
}

const start = (dispatch) => {
  return () => {
    if (settings.exit) {
      return;
    }

    dispatch(actions.websocketConnecting());

    settings.websocket = new WebSocket(settings.url);
    settings.websocket.onopen = onOpen(dispatch);
    settings.websocket.onclose = onClose(dispatch);
    settings.websocket.onmessage = onMessage(dispatch);
  }
}

const sendOnConnect = (payload, callback, retrycount) => {
  if (settings.open) {
    settings.websocket.send(JSON.stringify(payload));

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
  setTimeout(function () { sendOnConnect(payload, callback, retrycount + 1) }, 5);
}

const WebsocketMiddleware = ({dispatch}) => next => action => {
  switch (action.type) {
    case ActionTypes.WEBSOCKET_CONNECT: {
      settings.url = action.payload.url
      start(dispatch)();
      break;
    }
    case ActionTypes.WEBSOCKET_DISCONNECT: {
      settings.exit = true;
      settings.websocket.close();
      break;
    }
    case ActionTypes.WEBSOCKET_SEND: {
      sendOnConnect( action.payload );
      break;
    }

    default:
      return next(action);
  };
};

export default WebsocketMiddleware;
