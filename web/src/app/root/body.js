import React, { Component } from "react";
import { withStateScoped } from "../util";

import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Route } from "react-router-dom";
import { routes } from "../routes";

import Header from "./header";

import { Notify, Confirm } from "../util";

const Routes = () => (
  <>
    {Object.keys(routes)
      .filter(k => routes[k].path !== "")
      .map(k => {
        const route = routes[k];
        return (
          <Route
            key={k}
            exact={route.isExact}
            path={route.path}
            component={route.component}
          />
        );
      })}
  </>
);

const NotConnected = () => (
  <div style={{ margin: "10px", width: "400px" }}>
    <Typography variant="h4">Attempting to connect to webserver ...</Typography>

    <LinearProgress color="primary" />
  </div>
);

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
          {webSocket.connected && <Routes />}
          {!webSocket.connected && <NotConnected />}
        </div>
        <Confirm />
        <Notify />
      </>
    );
  }
}

export default withStateScoped("webSocket")(Body);
