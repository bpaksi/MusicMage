import * as serverMessages from "./serverMessages";

export const webSocketMessage = (state, action) => {
  if (action.type === "webSocketMessage") {
    const message = action.parameters.data;
    const funcName = camelize(message.type.replace("_", " ").toLowerCase());

    if (serverMessages[funcName]) {
      return serverMessages[funcName](state, message);
    }

    return state;
  }
};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}
