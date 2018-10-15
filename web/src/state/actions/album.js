import { webSocketSend } from "./webSocket";

export const albumSubscribe = (artist, album) => dispatch => {
  dispatch(albumSubscribed());
  dispatch(
    webSocketSend({
      type: "ALBUM_SUBSCRIBE",
      payload: {
        artist,
        album
      }
    })
  );
};

export const albumUnsubscribe = () => dispatch => {
  dispatch(
    webSocketSend(
      {
        type: "ALBUM_UNSUBSCRIBE"
      },
      data => {
        dispatch(albumUnsubscribed(data));
      }
    )
  );
};

export const albumSubscribed = () => ({
  type: "albumSubscribed",
  reduce: () => ({songs: []})
});

export const albumUnsubscribed = data => ({
  type: "albumUnsubscribed",
  parameters: { data },
  reduce: () => ({songs: []})
});

export const songAdded = data => ({
  type: "songAdded",
  parameters: { data },
  reduce: state => ({ songs: [...state.songs, data] })
});
