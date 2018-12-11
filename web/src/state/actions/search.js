export const searchForAlbums = (artist) => ({
  type: "searchForAlbums",
  parameters: { artist },
  reduce: () => ({ songs: [] }),
  webSocketSend: {
    type: "SEARCH_ALBUM",
    payload: {
      artist,
    }
  },
  webSocketResults: ({ dispatch, payload }) => {
    dispatch(searchForAlbumsResult(payload));
  }
});

export const searchForAlbumsResult = (results) => ({
  type: "searchForAlbumsResult",
  parameters: { results },
});