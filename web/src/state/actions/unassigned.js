import { webSocketSend } from "./webSocket";

const scope = "unassigned";

export const unassignedSubscribe = () => ({
  type: "unassignedSubscribe",
  scope,
  reduce: () => ({ all: [] }),
  afterReduce: ({ dispatch }) => {
    dispatch(webSocketSend("UNASSIGNED_SUBSCRIBE"));
  }
});

export const unassignedUnsubscribe = () => ({
  type: "unassignedUnsubscribe",
  scope,
  beforeReduce: ({ dispatch }) => {
    dispatch(webSocketSend("UNASSIGNED_UNSUBSCRIBE"));
  },
  reduce: () => ({ all: [] })
});

export const unassignedFetched = unassigned => ({
  type: "unassignedFetched",
  scope,
  parameters: unassigned,
  reduce: () => {
    const all = unassigned.map(i => {
      const parts = i.fileName.split("-");

      var suggestedArtist = "";
      var suggestedAlbum = "";
      var suggestedTitle = "";

      if (parts.length >= 1) {
        suggestedArtist = parts[0].trim();
      }
      if (parts.length >= 2) {
        suggestedAlbum = parts[1].trim();
      }
      if (parts.length >= 3) {
				suggestedTitle = parts[2].trim();
				if (suggestedTitle.endsWith(".mp3")) {
					suggestedTitle = suggestedTitle.substring(0, suggestedTitle.length-4)
				}
      }

      return { ...i, suggestedArtist, suggestedAlbum, suggestedTitle };
    });

    return { all };
  }
});

export const unassignedAdded = song => ({
  type: "unassignedAdded",
  scope,
  parameters: { song },
  reduce: state => ({ unassigned: [...state.unassigned, song] })
});

export const unassignedDelete = song => ({
  type: "unassignedDelete",
  scope,
  parameters: { song }
});

export const unassignedUpdated = song => ({
  type: "unassignedUpdated",
  scope,
  parameters: { song }
});

export const searchForArtist = artist => ({
  type: "unassignedUpdated",
  scope,
  parameters: { artist },
  webSocketSend: {
    type: "SEARCH_ALBUM",
    payload: {
      artist
    }
  }
});
