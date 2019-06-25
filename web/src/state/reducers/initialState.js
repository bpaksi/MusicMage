export const initialState = {
  artists: [],
  songs: [],
	unassigned:[],
	genres: {
		items: [] // []string
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
