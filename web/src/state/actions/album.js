import { webSocketSend } from "./webSocket";

export const albumSubscribe = (artist, album) => ({
  type: "albumSubscribe",
  parameters: { artist, album },
  reduce: () => ({ songs: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(
      webSocketSend("ALBUM_SUBSCRIBE", {
        artist,
        album
      })
    );
  }
});

export const albumUnsubscribe = () => ({
  type: "albumUnsubscribe",
  reduce: () => ({ songs: [] }),
  beforeReduce: ({ dispatch }) => {
    dispatch(webSocketSend("ALBUM_UNSUBSCRIBE"));
  }
});

export const albumFetched = songs => ({
  type: "albumFetched",
  parameters: { songs },
  reduce: () => ({ songs })
});

export const songAdded = song => ({
  type: "songAdded",
  parameters: { song },
  reduce: state => ({ songs: [...state.songs, song] })
});

export const songDelete = song => ({
  type: "songDelete"
});
