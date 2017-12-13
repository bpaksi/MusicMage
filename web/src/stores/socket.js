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

      console.log("socket received data", message)
      
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
    // console.log("Socket action called", action);
    
    switch (action.name) {
      case "artist subscribe":

      sendMessage(this.ws, action)

        break;
        case "artist unsubscribe":
          sendMessage(this.ws, action)

        break;
        default:
    }
  }
}

function sendMessage(socket, msg){
  console.log("socket.send:" + msg.name)
  
  // Wait until the state of the socket is not ready and send the message when it is...
  waitForSocketConnection(socket, function(){
      console.log("sending message: " + msg.name)
      socket.send(JSON.stringify(msg));
  });
}

function waitForSocketConnection(socket, callback){
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
