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
    messages: [] // {message, type} type: "", success, error
  },
  confirm: {
    open: false,
    title: "",
    body: "",
    onConfirm: null
  },
  webSocket: {
    url: "",
    socket: null,
    forceExit: false,
    callbacks: [] // {key, callback}
  }
};

export default (state = initialState, action) => {
  if (action.reduce) {
    const results = action.reduce(state, action);
    return { ...state, ...results };
  }

  return state;
};
