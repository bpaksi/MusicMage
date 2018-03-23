import { ActionTypes, NotifyStatuses } from './constants';
import * as util from './util'

const defaultState = {
  id: 0,
  artists: [],
  songs: [],
  genre: {
    loaded: false,
    options: [],
  },
  notify: {
    open: false,
    message: "",
    status: NotifyStatuses.DEFAULT,
  },
  confirm: {
    open: false,
    title: "",
    body: "",
    onConfirm: null,
  }
};

export default (state=defaultState, action) => {
  util.deepFreeze(state);
  
  switch (action.type) {
    case ActionTypes.WEBSOCKET_CONNECTED: {
      const notify = {...state.notify, 
        open: true,
        message: "Server connected",
        status: NotifyStatuses.SUCCESS,
      };

      return {...state, notify};
    }

    case ActionTypes.WEBSOCKET_DISCONNECTED: {
      const notify = {...state.notify, 
        open: true,
        message: "Lost server connection!",
        status: NotifyStatuses.ERROR,
      };

      return {...state, notify};
    }

    case ActionTypes.ARTIST_SUBSCRIBE: { 
      return {...state, artists: []};
    }
    case ActionTypes.ARTIST_UNSUBSCRIBE: { 
      return {...state, artists: []};
    }
    case ActionTypes.ARTIST_ADDED: {
      const artists = [...state.artists, action.payload];
      return {...state, artists};
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

      return {...state, artists};
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

      return {...state, artists};
    }

    case ActionTypes.ALBUM_SUBSCRIBE: { 
      return {...state, songs: []};
    }
    case ActionTypes.ALBUM_UNSUBSCRIBE: { 
      return {...state, songs: []};
    }

    case ActionTypes.SONG_ADDED: {
      const songs = [...state.songs, action.payload];
      return {...state, songs};
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

      return {...state, songs};
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

      const confirm = {...state.confirm, open: false};
      return {...state, songs, confirm};
    }
    case ActionTypes.SONG_UPDATE_ERR: {
      const error = action.payload;
      const notify = {...state.notify, 
        open: true,
        message: "Update error: " + error,
        status: NotifyStatuses.ERROR,
      };

      const confirm = {...state.confirm, open: false};
      return {...state, confirm, notify};
    }

    case ActionTypes.FETCH_GENRES: {
      const genre = {...state.genre, loaded: true, options: []};
      return {...state, genre};
    }

    case ActionTypes.GENRE: {
      const genre = {...state.genre};

      genre.options = [...genre.options, action.payload];
      return {...state, genre};
    }

    case ActionTypes.NOTIFY_CLOSE: {
      const notify = {...state.notify, open: false};
      
      return {...state, notify};
    }

    case ActionTypes.CONFIRM: {
      const confirm = {...state.confirm, 
        open: true,
        title: action.payload.title,
        body: action.payload.body,
        onConfirm: action.payload.onConfirm,
      };
      
      return {...state, confirm};
    }
    case ActionTypes.CONFIRM_CLOSE: {
      const confirm = {...state.confirm, open: false};
      
      return {...state, confirm};
    }

    default: {
      return state;
    }
  }
}