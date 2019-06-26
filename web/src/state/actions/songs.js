import { webSocketSend } from "./webSocket";

const scope = "songs";

export const albumFetched = songs => ({
  type: "albumFetched",
  scope,
  parameters: { songs },
  reduce: () => ({ source: songs, ...reconcile(songs, {}) })
});

export const songUpdated = song => ({
  type: "songUpdated",
  scope,
  parameters: { song },
  reduce: (state) => {
		const source = [...state.source]
		const idx = source.findIndex(i => i.id === song.id)
		if (idx >= 0) {
			source[idx] = song
		}

    return { source, ...reconcile(source, state.dirty) };
  }
});

export const songsSaveChanges = () => ({
  type: "songsSaveChanges",
  scope,
  afterReduce: ({ dispatch, getState }) => {
    const { source, dirty } = getState();

    const updates = [];
    Object.keys(dirty).forEach(id => {
      const song = source.find(s => s.id === id);
      if (song) {
        updates.push({
          id,
          ...song,
          ...dirty[id]
        });
      }
    });

    dispatch(webSocketSend("ALBUM_SAVE", updates));
  }
});

export const songChange = (id, field, value) => ({
  type: "songChange",
  scope,
  parameters: { id, field, value },
  reduce: state => {
    const dirty = { ...state.dirty };
    dirty[id] = { ...dirty[id], [field]: value };

    return reconcile(state.source, dirty);
  }
});

export const songUndo = (id, field) => ({
  type: "songUndo",
  scope,
  parameters: { id, field },
  reduce: state => {
    const dirty = { ...state.dirty };
    const { [field]: _, ...dirtySong } = dirty[id];
    dirty[id] = dirtySong;

    return reconcile(state.source, dirty);
  }
});

export const songUndoAll = () => ({
  type: "songUndoAll",
  scope,
  reduce: state => reconcile(state.source, {})
});

const reconcile = (source, curDirty) => {
  const dirty = {};

  Object.keys(curDirty).forEach(songId => {
    const song = source.find(i => i.id === songId);
    if (song) {
      const dirtySong = {};
      const curDirtySong = curDirty[songId];
      Object.keys(curDirtySong).forEach(field => {
        if (curDirtySong[field] !== song[field]) {
          dirtySong[field] = curDirtySong[field];
        }
      });

      if (Object.keys(dirtySong).length !== 0) {
        dirty[songId] = dirtySong;
      }
    }
  });

  const all = source.map(s => ({
    ...s,
    ...dirty[s.id],
    dirtyFields: dirty[s.id] ? Object.keys(dirty[s.id]) : []
  }));

  // console.log("songs.reconcile", { all, dirty });
  return { all, dirty, hasChanges: Object.keys(dirty).length > 0 };
};
