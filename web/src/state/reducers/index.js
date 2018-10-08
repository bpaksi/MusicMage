import { NotifyStatuses } from "../actions/notify";
import { webSocketMessage } from "./webSocketMessage" 

const initialState = {
  artists: [],
  songs: [],

  navigation: {
    direction: "forward",
    stack: [
      {
        key: "library",
        keyParam: ""
      }
    ]
  },
  notify: {
    open: false,
    message: "",
    status: NotifyStatuses.DEFAULT
  },
  confirm: {
    open: false,
    title: "",
    body: "",
    onConfirm: null
  },
  webSocket: {
    attemptRestart: true,
    open: false,
    manualExit: false,
    url: "",
    socket: null
  }
};

export default (state = initialState, action) => {
	var reducers = [webSocketMessage];
	if (action.reduce) {
		reducers = [action.reduce, ...reducers];
	}
	
	var newState = state
	reducers.forEach( reducer => {
		const reducerState = reducer(newState, action);
		newState = {...newState, ...reducerState};
	})
	
	return newState;
}
