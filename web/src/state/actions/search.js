import { webSocketSend } from "./webSocket";

export const searchForAlbums = artist => ({
  type: "searchForAlbums",
  parameters: { artist },
  reduce: () => ({ songs: [] }),
  afterReduce: ({dispatch}) => {
    dispatch(webSocketSend("SEARCH_ALBUM", artist));
  }
});

export const searchForAlbumsResult = results => ({
  type: "searchForAlbumsResult",
  parameters: { results }
});
