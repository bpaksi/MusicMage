import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose } from "../util";

import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./header";
import Navigation from "./navigation";
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
		const {webSocket} = this.props

    return (
      <>
        <CssBaseline />
        <Header />
        <Navigation />
        {webSocket.connected && (<Client />)}
        {!webSocket.connected && (<h2>Connecting ...</h2>)}
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
