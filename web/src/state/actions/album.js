export const albumSubscribe = (artist, album) => ({
  type: "albumSubscribe",
  parameters: { artist, album },
  reduce: () => ({ songs: [] }),
  webSocketSend: {
    type: "ALBUM_SUBSCRIBE",
    payload: {
      artist,
      album
    }
  },
  webSocketResults: ({ dispatch, results }) => {
    dispatch(albumSubscribed(results));
  }
});

export const albumUnsubscribe = () => ({
  type: "albumUnsubscribe",
  reduce: () => ({ songs: [] }),
  webSocketSend: {
    type: "ALBUM_UNSUBSCRIBE"
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
