import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";

import Header from "./header";
import Navigation from "./navigation";
import Client from "./client";

const styles = theme => ({
});

class Body extends Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.webSocketConnect("ws://localhost:4000/api");
  }
  componentWillUnmount() {
    const { actions } = this.props;
    actions.webSocketDisconnect();
  }

  render() {
    return (
      <>
        <Header />
        <Navigation />
        <Client />
      </>
    );
  }
}
export default compose(
  withState(),
  withStyles(styles)
)(Body);
