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

});

export const searchForAlbumsResult = (results) => ({
  type: "searchForAlbumsResult",
  parameters: { results },
});