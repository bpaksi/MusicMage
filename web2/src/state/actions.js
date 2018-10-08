import ActionTypes from "./constants";

//#region artist
export function artistSubscribe(artist) {
  return {
    type: ActionTypes.ARTIST_SUBSCRIBE,
    payload: artist ? artist : "",
    redirectToServer: true,
  };
}

export function artistUnsubscribe() {
  return {
    type: ActionTypes.ARTIST_UNSUBSCRIBE,
    redirectToServer: true,
  };
}
//#endregion

//#region album
export function albumSubscribe(artist, album) {
  return {
    type: ActionTypes.ALBUM_SUBSCRIBE,
    payload: {
      artist,
      album,
    },
    redirectToServer: true,
  };
}

export function albumUnsubscribe() {
  return {
    type: ActionTypes.ALBUM_UNSUBSCRIBE,
    redirectToServer: true,
  };
}
//#endregion

//#region songs
export function songUpdate(updatedSong) {
  return {
    type: ActionTypes.SONG_UPDATE,
    payload: {
      id: updatedSong.id,
      artist: updatedSong.artist,
      album: updatedSong.album,
      title: updatedSong.title,
      genre: updatedSong.genre,
      year: updatedSong.year
    },
    redirectToServer: true,
  };
}

export function confirmSongDelete(id, artist, title) {
  return {
    type: ActionTypes.CONFIRM,
    payload: {
      title: "Confirm Delete",
      body: "Are you sure you want to delete preset <strong>" + title + " </strong>",
      onConfirm: () => songDelete(id),
    }
  };
}

export function songDelete(id) {
  return {
    type: ActionTypes.SONG_DELETE,
    payload: id,
    redirectToServer: true,
  };
}
//#endregion

//#region folders
export function fetchFolders() {
  return {
    type: ActionTypes.FOLDERS_FETCH,
    redirectToServer: true,
  };
}

export function fetchSongs(path) {
  return {
    type: ActionTypes.FOLDER_FETCH,
    payload:path,
    redirectToServer: true,
  };
}
//#endregion

//#region search
export function selectFolder(id) {
  return {
    type: ActionTypes.FOLDER_SELECT,
    payload: id,
  };
}

export function searchOpen(artist, album){
  return {
    type: ActionTypes.SEARCH_OPEN,
    payload: {
      artist,
      album,
    },
  };
}

export function searchArtistFilter(searchText){
  return {
    type: ActionTypes.SEARCH_ARTIST_FILTER,
    payload: searchText,
  };
}
export function searchArtistSelect(artist){
  return {
    type: ActionTypes.SEARCH_ARTIST_SELECT,
    payload: artist,
  };
}

export function searchClose() {
  return {
    type: ActionTypes.SEARCH_CLOSE,
  };
}

export function searchForAlbums(artist) {
  return {
    type: ActionTypes.SEARCH_ALBUM,
    payload: { artist },
    redirectToServer: true,
  };
}

export function searchForTracks(artist, album) {
  return {
    type: ActionTypes.SEARCH_TRACKS,
    payload: {
      artist,
      album
    },
  };
}
//#endregion

//#region websocket 
export function websocketConnect(url) {
  return {
    type: ActionTypes.WEBSOCKET_CONNECT,
    payload: { url },
  };
}

export function websocketConnecting() {
  return {
    type: ActionTypes.WEBSOCKET_CONNECTING,
  };
}

export function websocketConnected() {
  return {
    type: ActionTypes.WEBSOCKET_CONNECTED,
  };
}

export function websocketDisconnected(closeEvent) {
  return {
    type: ActionTypes.WEBSOCKET_DISCONNECTED,
    payload: closeEvent,
  };
}

export function websocketMsgError(data, error) {
  return {
    type: ActionTypes.WEBSOCKET_MSG_ERROR,
    payload: {
      data,
      error,
    },
  };
}

export function websocketDisconnect() {
  return {
    type: ActionTypes.WEBSOCKET_DISCONNECT,
  };
}
//#endregion

//#region utility
export function notifyClose() {
  return {
    type: ActionTypes.NOTIFY_CLOSE,
  };
}

export function confirmClose() {
  return {
    type: ActionTypes.CONFIRM_CLOSE,
  };
}

export function fetchGenres() {
  return {
    type: ActionTypes.GENRES_FETCH,
    redirectToServer: true,
  };
}
//#endregion