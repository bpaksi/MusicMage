export default ({ getState, dispatch }) => next => action => {
	const { beforeReduce, afterReduce, scope } = action;
	
	var getScopedState = getState 
	if (scope) {
		getScopedState = () => (getState()[scope]);
	}

  if (isFunction(beforeReduce)) {
    const results = beforeReduce({ getState: getScopedState, dispatch, action });

    if (isBoolean(results)) {
      if (results === false) {
        return;
      }
    } else if (results) {
      action = { ...action, ...results };
    }
  }

  const results = next(action);

  if (isFunction(afterReduce)) {
    afterReduce({ getState: getScopedState, dispatch, action });
  }

  return results;
};

const isFunction = obj => typeof obj === "function";

const isBoolean = obj => typeof obj === "boolean";
