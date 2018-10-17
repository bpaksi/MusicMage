import React from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as actionMethods from "../state/actions";

const defaultDispatch2Props = () => {
  var actions;
  return dispatch => {
    if (!actions) {
      actions = {...bindActionCreators(actionMethods, dispatch), dispatch};
    }

    return { actions };
  };
};

export function withState(mapStateToProps) {
  return Wrapped => {
    return connect(
      mapStateToProps || (state => state),
      defaultDispatch2Props()
    )(props => <Wrapped {...props} />);
  };
}

export function withStateScoped(scope) {
	if (!scope) return withState();

  return Wrapped => {
    return connect(
      state => ({ [scope]: state[scope] }),
      defaultDispatch2Props()
    )(props => <Wrapped {...props} />);
  };
}

export function withActionsOnly() {
  return Wrapped => {
    return connect(
      () => ({}),
      defaultDispatch2Props()
    )(props => <Wrapped {...props} />);
  };
}

export { compose };
