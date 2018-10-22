export const initialState = {
  artists: [],
  songs: [],

	genres: {
		items: [] // []string
	},

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
    socket: null,
  }
};
