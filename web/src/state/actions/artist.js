import { webSocketSend } from "./webSocket";

export const artistSubscribe = artist => ({
  type: "artistSubscribe",
  parameters: { artist },
  reduce: () => ({ artists: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(
      webSocketSend(
        {
          type: "ARTIST_SUBSCRIBE",
          payload: artist ? artist : ""
        },
        results => {
          dispatch(artistSubscribed(results));
        }
      )
    );
  }
});

const artistSubscribed = results => ({
  type: "artistSubscribed",
  parameters: { results }
});

export const artistUnsubscribe = () => ({
  type: "artistUnsubscribe",
  reduce: () => ({ artists: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(
      webSocketSend({
        type: "ARTIST_UNSUBSCRIBE"
      })
    );
  }
});

export const artistAdded = artist => ({
  type: "artistAdded",
  parameters: { artist },
  reduce: state => ({ artists: [...state.artists, artist] })
});
