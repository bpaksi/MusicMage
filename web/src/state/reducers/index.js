import {initialState} from './initialState'

export default (state = initialState, action) => {
  const { reduce, scope } = action;

  if (reduce) {
    var results = reduce(scope ? state[scope] : state, action);
    if (scope) {
      results = { [scope]: { ...state[scope], ...results } };
    }

    return { ...state, ...results };
  }

  return state;
};
