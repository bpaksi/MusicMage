const initialState = {
  artists: [],
  songs: [],

  navigation: {
    pageKey: 1,
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
    reconnect: false,
    callbacks: [] // {key, callback}
  }
};

export default (state = initialState, action) => {
  const { reduce, scope } = action;

  if (reduce) {
    var results = reduce(scope ? state[scope] : state, action);
    if (scope) {
      results = { [scope]: { ...state[scope], ...results } };
    }

    return { ...state, ...results };
  }

  return state;
};
