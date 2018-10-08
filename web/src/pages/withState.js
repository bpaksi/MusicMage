import React from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../state/actions";

const defaultState2Props = state => ({...state});
const defaultDispatch2Props = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export function withState(mapStateToProps) {
  return Wrapped => {
    return connect(
      mapStateToProps ? mapStateToProps : defaultState2Props,
      defaultDispatch2Props
    )(props => <Wrapped {...props} />);
  };
}

export { compose };
