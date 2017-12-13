import { EventEmitter } from 'events';
import dispatcher from "../dispatcher";
import * as GenericActions from '../actions/generic';

class Socket extends EventEmitter {
  constructor(ws = new WebSocket("ws://localhost:4000/api")) {
    super();

    this.ws = ws;
    this.ws.onmessage = this.message.bind(this);
    this.ws.onopen = this.open.bind(this);
    this.ws.onclose = this.close.bind(this);
  }

  message(e) {
    try {
      const message = JSON.parse(e.data);

      //  console.log("socket received data", message)
      GenericActions.Raw(message.name, message.data);
    }
    catch (err) {
      GenericActions.Error(err);
    }
  }

  open() {
    this.emit('socket connect')
  }
  close() {
    this.emit('socket disconnect')
  }

  handleActions(action) {
    const validNames = [
      "artist subscribe",
      "artist unsubscribe",
      "song update",
      "song delete",
      "file move",
    ]

    if (validNames.indexOf(action.name) !== -1) {
      waitForSocketConnection(this.ws, () => {
        // console.log("sending message: " + action.name)

        this.ws.send(JSON.stringify(action));
      });
    }
  }
}

function waitForSocketConnection(socket, callback) {
  if (socket.readyState === 1) {
    callback();
    return;
  }

  setTimeout(
    function () {
      if (socket.readyState === 1) {
        callback();
        return;
      }

      waitForSocketConnection(socket, callback);
    }, 5); // wait 5 milisecond for the connection...
}

const socket = new Socket();
dispatcher.register(socket.handleActions.bind(socket))

export default socket;
