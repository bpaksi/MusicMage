import { EventEmitter } from "events";
import dispatcher from "../dispatcher";

class AlertStore extends EventEmitter {
  constructor() {
    super();

    this.alerts = []
  }

  pop() {
    return this.alerts;
  }

  handleActions(action) {
    // console.log("SnackBarStore action called", action);

    switch (action.name) {

      case "Error":
        this.alerts.push({ type: "Error", text: action.data })
        break;
      default:
    }
  }
}

const alertStore = new AlertStore();
dispatcher.register(alertStore.handleActions.bind(alertStore))

export default alertStore