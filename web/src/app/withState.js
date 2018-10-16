import React from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../state/actions";

const defaultState2Props = mapStateToProps => (state, props) =>
  mapStateToProps ? { ...state, ...mapStateToProps(state, props) } : state;

const defaultDispatch2Props = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export function withState(mapStateToProps) {
  return Wrapped => {
    return connect(
      defaultState2Props(mapStateToProps),
      defaultDispatch2Props
    )(props => <Wrapped {...props} />);
  };
}

export { compose };
