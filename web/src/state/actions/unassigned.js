export const unassignedSubscribe = (artist, album) => ({
  type: "unassignedSubscribe",
  parameters: { artist, album },
  reduce: () => ({ songs: [] }),
  webSocketSend: {
    type: "UNASSIGNED_SUBSCRIBE",
    payload: {
      artist,
      album
    }
  },

});

export const unassignedUnsubscribe = () => ({
  type: "unassignedUnsubscribe",
  reduce: () => ({ songs: [] }),
  webSocketSend: {
    type: "UNASSIGNED_UNSUBSCRIBE"
  }
});

const unassignedSubscribed = results => ({
  type: "unassignedSubscribed",
  parameters: { results }
});

export const unassignedAdded = song => ({
  type: "unassignedAdded",
  parameters: { song },
  reduce: state => ({ unassigned: [...state.unassigned, song] })
});

export const unassignedDelete = song => ({
  type: "unassignedDelete",
  parameters: { song }
});

export const unassignedUpdated = song => ({
  type: "unassignedUpdated",
  parameters: { song }
});

export const searchForArtist = artist => ({
  type: "unassignedUpdated",
  parameters: { artist },
  webSocketSend: {
    type: "SEARCH_ALBUM",
    payload: {
      artist
    }
  }
});
