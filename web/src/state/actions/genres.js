import { webSocketSend } from "./webSocket";

const scope = "genres";

export const genresSubscribe = () => ({
  type: "genresSubscribe",
  scope,
  reduce: () => ({ all: [], source: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(webSocketSend("GENRES_SUBSCRIBE"));
  }
});

export const genresUnsubscribe = () => ({
  type: "genresUnsubscribe",
  scope,
  reduce: () => ({ all: [], source: [] }),
  beforeReduce: ({ dispatch }) => {
    dispatch(webSocketSend("GENRES_UNSUBSCRIBE"));
  }
});

export const genresUpdated = genres => ({
  type: "genresUpdated",
  scope,
  reduce: state => {
    return { source: genres, all: removeDups([...genres, ...state.added, ""]) };
  }
});

export const genreAdd = genre => ({
  type: "genreAdd",
  scope,
  reduce: state => {
    const added = [...state.added, genre];
    return { added, all: removeDups([...state.source, ...added]) };
  }
});

const removeDups = ary => {
  var results = [];
  for (var i = 0; i < ary.length; i++) {
    var found = false;
    for (var j = 0; j < results.length; j++) {
      if (ary[i] === results[j]) {
        found = true;
        break;
      }
    }

    if (!found) {
      results.push(ary[i]);
    }
  }

  // console.log("removeDups", { ary, len: ary.length, results });
  return results.sort();
};
