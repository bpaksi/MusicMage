export default ({ getState, dispatch }) => next => action => {
  const { beforeReduce, afterReduce } = action;
  if (isFunction(beforeReduce)) {
    const results = beforeReduce({ getState, dispatch, action });

    if (isBoolean(results)) {
      if (results === false) {
        return;
      }
    }

    if (results) {
      action = { ...action, ...results };
    }
  }

  const results = next(action);

  if (isFunction(afterReduce)) {
    afterReduce({ getState, dispatch, action });
  }

  return results;
};

const isFunction = obj => typeof obj === "function";

const isBoolean = obj => typeof obj === "boolean";
