import { webSocketSend } from "./webSocket";

export const unassignedSubscribe = (artist, album) => ({
  type: "unassignedSubscribe",
  parameters: { artist, album },
  reduce: () => ({ songs: [] }),
  afterReduce: dispatch => {
    dispatch(
      webSocketSend("UNASSIGNED_SUBSCRIBE", {
        artist,
        album
      })
    );
  }
});

export const unassignedUnsubscribe = () => ({
  type: "unassignedUnsubscribe",
  reduce: () => ({ songs: [] }),
  afterReduce: dispatch => {
    dispatch(webSocketSend("UNASSIGNED_UNSUBSCRIBE"));
  }
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
