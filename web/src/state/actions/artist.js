import { webSocketSend } from "./webSocket";

export const artistSubscribe = artist => ({
  type: "artistSubscribe",
  parameters: { artist },
  reduce: () => ({ artists: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(webSocketSend("ARTIST_SUBSCRIBE", artist ? artist : ""));
  }
});

export const artistUnsubscribe = () => ({
  type: "artistUnsubscribe",
  reduce: () => ({ artists: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(webSocketSend("ARTIST_UNSUBSCRIBE"));
  }
});

export const artistsFetched = artists => ({
  type: "artistsFetched",
  parameters: { artists },
  reduce: () => ({ artists: [...artists] })
});

export const artistAdded = artist => ({
  type: "artistAdded",
  parameters: { artist },
  reduce: state => ({ artists: [...state.artists, artist] })
});
