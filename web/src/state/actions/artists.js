import { webSocketSend } from "./webSocket";

export const artistSubscribe = artist => dispatch => {
  dispatch(
    webSocketSend({
      type: "ARTIST_SUBSCRIBE",
      payload: artist ? artist : ""
    })
  );

  dispatch(artistSubscribed());
};

export const artistSubscribed = () => ({
  type: "artistSubscribed",
  reduce: () => ({ artists: [] })
});

export const artistUnsubscribe = () => dispatch => {
  dispatch(
    webSocketSend({
      type: "ARTIST_UNSUBSCRIBE"
    })
  );

  dispatch(artistUnsubscribed());
};

export const artistUnsubscribed = () => ({
  type: "artistUnsubscribed",
  reduce: () => ({ artists: [] })
});
