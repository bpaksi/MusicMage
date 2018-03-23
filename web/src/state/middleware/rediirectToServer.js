import ActionTypes from "../constants";

const rediretActions = [
  ActionTypes.ARTIST_SUBSCRIBE,
  ActionTypes.ARTIST_UNSUBSCRIBE,
  ActionTypes.ALBUM_SUBSCRIBE,
  ActionTypes.ALBUM_UNSUBSCRIBE,
  ActionTypes.SONG_UPDATE,
  ActionTypes.SONG_DELETE,
  ActionTypes.FETCH_GENRES,
];

export default store => next => action => {
  const exists = rediretActions.indexOf(action.type) > -1;
  if (exists) {
    store.dispatch({
      type: ActionTypes.WEBSOCKET_SEND,
      payload: action,
    });
  }

  return next(action);
};


