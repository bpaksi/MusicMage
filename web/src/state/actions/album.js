import { webSocketSend } from "./webSocket";

export const albumSubscribe = (artist, album) => ({
  type: "albumSubscribe",
  parameters: { artist, album },
  reduce: () => ({ songs: { all: [], source: [], dirty: {} } }),
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
  beforeReduce: ({ dispatch }) => {
    dispatch(webSocketSend("ALBUM_UNSUBSCRIBE"));
  },
  reduce: () => ({ songs: { all: [], source: [], dirty: {} } })
});
