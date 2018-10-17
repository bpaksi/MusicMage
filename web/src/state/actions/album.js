import { webSocketSend } from "./webSocket";

export const albumSubscribe = (artist, album) => ({
  type: "albumSubscribe",
  parameters: { artist, album },
  reduce: () => ({ songs: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(
      webSocketSend(
        {
          type: "ALBUM_SUBSCRIBE",
          payload: {
            artist,
            album
          }
        },
        results => {
          dispatch(albumSubscribed(results));
        }
      )
    );
  }
});

export const albumUnsubscribe = () => ({
  type: "albumUnsubscribe",
  reduce: () => ({ songs: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(
      webSocketSend({
        type: "ALBUM_UNSUBSCRIBE"
      })
    );
  }
});

const albumSubscribed = results => ({
  type: "albumSubscribed",
  parameters: { results }
});

export const songAdded = song => ({
  type: "songAdded",
  parameters: { song },
  reduce: state => ({ songs: [...state.songs, song] })
});

export const songDelete = song => ({
  type: "songDelete"
});
