export const initialState = {
  artists: [],
  songs: {
    all: [],
    source: [],
    dirty: {},
    hasChanges: false
  },
  unassigned: {
    all: [],
    search: {
      artist: "",
      album: ""
    }
  },
  genres: {
    all: [], // []string
    source: [],
    added: []
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
    socket: null
  }
};
