function webSockResultToAction(handler) {
  return ({ dispatch }) => next => action => {
    var handled = false;
    if (action.type === "webSocketMessage") {
      const { type, payload } = action.parameters.message;
      const funcName = camelize(type.replace("_", " ").toLowerCase());

      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i][funcName]) {
          dispatch(arguments[i][funcName](payload));
          handled = true;
        }
      }
    }

    if (!handled) {
      return next(action);
    }
  };
}

export default webSockResultToAction;

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}
