import ActionTypes from "../constants";
import * as actions from "../../state/actions";

export default ({ dispatch, getState }) => next => action => {
  const results = next(action);
  if (action.type === ActionTypes.FOLDER_SELECT) {
    const state = getState();

    const selected = selectedPath(state.folders.selected, state.folders.all);
    if (selected.found) {
      dispatch(actions.fetchSongs(selected.path));
    }
  }

  return results;
};

function selectedPath(id, folders) {
  if (folders) {
    for (var i = 0; i < folders.length; i++) { 
      if (folders[i]._id === id) {
        return { found: true, path: folders[i].name };
      }

      const res = selectedPath(id, folders[i].children);
      if (res.found) {
        return { found: true, path: folders[i].name + "/" + res.path };
      }
    };
  }

  return { found: false };
}
