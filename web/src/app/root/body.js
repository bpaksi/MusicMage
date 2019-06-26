import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose } from "../util";

import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./header";

import Client from "./client";
import { Notify, Confirm } from "../util";

const styles = theme => ({});

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
    const { webSocket } = this.props;

    return (
      <>
        <CssBaseline />
        <Header />

        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
          {webSocket.connected && <Client />}
          {!webSocket.connected && <h2>Connecting ...</h2>}
        </div>
        <Confirm />
        <Notify />
      </>
    );
  }
}
export default compose(
  withStateScoped("webSocket"),
  withStyles(styles)
)(Body);
