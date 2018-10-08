import { ActionTypes, NotifyStatuses } from "./constants";
import * as util from "./util";

const defaultState = {
  id: 0,
  artists: [],
  songs: [],
  genre: {
    loaded: false,
    options: []
  },
  folders: {
    all: [],
    files: [],
    selected: 0
  },
  search: {
    open: false,
    step: 0,
    artist: "",
    album: "",
    artistFilter: "",
    selectedArtist: {},
    artistResults: [],
    albumResults: []
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
  }
};

export default (state = defaultState, action) => {
  util.deepFreeze(state);

  switch (action.type) {
    //#region websocket
    case ActionTypes.WEBSOCKET_CONNECTED: {
      const notify = {
        ...state.notify,
        open: true,
        message: "Server connected",
        status: NotifyStatuses.SUCCESS
      };

      return { ...state, notify };
    }

    case ActionTypes.WEBSOCKET_DISCONNECTED: {
      const notify = {
        ...state.notify,
        open: true,
        message: "Lost server connection!",
        status: NotifyStatuses.ERROR
      };

      return { ...state, notify };
    }
    //#endregion

    //#region artist
    case ActionTypes.ARTIST_SUBSCRIBE: {
      return { ...state, artists: [] };
    }
    case ActionTypes.ARTIST_UNSUBSCRIBE: {
      return { ...state, artists: [] };
    }
    case ActionTypes.ARTIST_ADDED: {
      const artists = [...state.artists, action.payload];
      return { ...state, artists };
    }
    case ActionTypes.ARTIST_UPDATED: {
      const id = action.payload.id;
      const index = state.artists.findIndex(artists => {
        return artists.id === id;
      });
      const artists = [
        ...state.artists.slice(0, index),
        action.payload,
        ...state.artists.slice(index + 1)
      ];

      return { ...state, artists };
    }
    case ActionTypes.ARTIST_DELETED: {
      const id = action.payload.id;
      const index = state.artists.findIndex(artists => {
        return artists.id === id;
      });
      const artists = [
        ...state.artists.slice(0, index),
        ...state.artists.slice(index + 1)
      ];

      return { ...state, artists };
    }
    //#endregion

    //#region album
    case ActionTypes.ALBUM_SUBSCRIBE: {
      return { ...state, songs: [] };
    }
    case ActionTypes.ALBUM_UNSUBSCRIBE: {
      return { ...state, songs: [] };
    }
    //#endregion

    //#region songs
    case ActionTypes.SONG_ADDED: {
      const songs = [...state.songs, action.payload];
      return { ...state, songs };
    }
    case ActionTypes.SONG_UPDATED: {
      const id = action.payload.id;
      const index = state.songs.findIndex(song => {
        return song.id === id;
      });

      const songs = [
        ...state.songs.slice(0, index),
        action.payload,
        ...state.songs.slice(index + 1)
      ];

      return { ...state, songs };
    }
    case ActionTypes.SONG_DELETED: {
      const id = action.payload.id;
      const index = state.songs.findIndex(song => {
        return song.id === id;
      });

      const songs = [
        ...state.songs.slice(0, index),
        ...state.songs.slice(index + 1)
      ];

      const confirm = { ...state.confirm, open: false };
      return { ...state, songs, confirm };
    }
    //#endregion

    //#region folder
    case ActionTypes.FOLDERS_FETCHED: {
      const folders = { ...state.folders, selected: 0 };
      folders.all = action.payload;
      decorateFolders(folders.all);

      return { ...state, folders };
    }

    case ActionTypes.FOLDER_SELECT: {
      const folders = { ...state.folders, selected: action.payload, files: [] };

      return { ...state, folders };
    }

    case ActionTypes.FOLDER_FETCHED: {
      const folders = { ...state.folders, files: action.payload };

      return { ...state, folders };
    }
    //#endregion

    //#region search
    case ActionTypes.SEARCH_OPEN: {
      const search = {
        ...state.search,
        open: true,
        step: 0,
        artistFilter: "",
        artist: action.payload.artist,
        album: action.payload.album
      };

      return { ...state, search };
    }

    case ActionTypes.SEARCH_ARTIST_FILTER: {
      const search = { ...state.search, artistFilter: action.payload };

      return { ...state, search };
    }
    case ActionTypes.SEARCH_ARTIST_SELECT: {
      const search = {
        ...state.search,
        step: 1,
        selectedArtist: action.payload
      };

      return { ...state, search };
    }

    case ActionTypes.SEARCH_CLOSE: {
      const search = { ...state.search, open: false };

      return { ...state, search };
    }
    case ActionTypes.SEARCH_ALBUM: {
      const search = { ...state.search };

      return { ...state, search };
    }
    case ActionTypes.SEARCH_TRACKS: {
      const search = { ...state.search };

      return { ...state, search };
    }
    case ActionTypes.SEARCH_ALBUM_RESULTS: {
      const search = {
        ...state.search,
        artistResults: action.payload
      };

      return { ...state, search };
    }
    case ActionTypes.SEARCH_TRACK_RESULTS: {
      const search = { ...state.search };

      return { ...state, search };
    }
    //#endregion

    //#region utility
    case ActionTypes.ERROR: {
      const error = action.payload;
      const notify = {
        ...state.notify,
        open: true,
        message: "Update error: " + error,
        status: NotifyStatuses.ERROR
      };

      const confirm = { ...state.confirm, open: false };
      return { ...state, confirm, notify };
    }

    case ActionTypes.GENRES_FETCH: {
      const genre = { ...state.genre, loaded: true, options: [] };
      return { ...state, genre };
    }

    case ActionTypes.GENRES_FETCHED: {
      const genre = { ...state.genre };

      genre.options = action.payload;
      return { ...state, genre };
    }

    case ActionTypes.NOTIFY_CLOSE: {
      const notify = { ...state.notify, open: false };

      return { ...state, notify };
    }

    case ActionTypes.CONFIRM: {
      const confirm = {
        ...state.confirm,
        open: true,
        title: action.payload.title,
        body: action.payload.body,
        onConfirm: action.payload.onConfirm
      };

      return { ...state, confirm };
    }

    case ActionTypes.CONFIRM_CLOSE: {
      const confirm = { ...state.confirm, open: false };

      return { ...state, confirm };
    }
    //#endregion

    default: {
      return state;
    }
  }
};

function decorateFolders(folders) {
  var id = 0;
  const f = flds => {
    if (flds) {
      flds.forEach(fld => {
        fld._id = ++id;
        f(fld.children);
      });
    }
  };

  f(folders);
  return id;
}
