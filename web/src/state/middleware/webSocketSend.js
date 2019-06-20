import { webSocketSend } from "../actions";

export default () => {
  return ({ dispatch }) => next => action => {
    const results = next(action);

    if (action.webSocketSend) {
      dispatch(webSocketSend(action.webSocketSend));
    }

    return results;
  };
};
