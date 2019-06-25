import { webSocketSend } from "./webSocket";

export const genresSubscribe = () => ({
  type: "genresSubscribe",
  reduce: () => ({ genres: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(webSocketSend("GENRES_SUBSCRIBE"));
  }
});

export const genresUnsubscribe = () => ({
  type: "genresUnsubscribe",
  reduce: () => ({ genres: [] }),
  beforeReduce: ({ dispatch }) => {
    dispatch(webSocketSend("GENRES_UNSUBSCRIBE"));
  }
});

export const genresUpdated = genres => ({
  type: "genresUpdated",
  reduce: () => ({ genres })
});


export const genreAdd = genre => ({
  type: "genreAdd",
  reduce: (state) => ({ genres: [...state.genres, genre] })
});