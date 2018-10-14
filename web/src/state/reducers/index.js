import { NotifyStatuses } from "../actions/notify";

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
  if (action.reduce) {
    const results = action.reduce(state, action);
    return { ...state, ...results };
  }

  return state;
};
