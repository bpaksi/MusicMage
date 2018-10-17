import { notifyError } from "../actions/notify";

export default () => ({ dispatch }) => next => action => {
  const { type, parameters } = action;

  if (type === "webSocketError") {
    dispatch(notifyError(parameters.message, parameters.data));
    return;
  }

  return next(action);
};
