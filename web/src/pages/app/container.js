import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";
import Header from "./header";
import Navigation from "./navigation";
import Body from "./body";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class Container extends Component {
  componentDidMount() {
		const {actions} = this.props;

    actions.webSocketConnect("ws://localhost:4000/api");
  }
  componentWillUnmount() {
		const {actions} = this.props;
    actions.webSocketDisconnect();
  }

  render() {
    const { classes } = this.props;

    return (
        <div className={classes.root}>
          <Header />
					<Navigation />
					<Body />
        </div>
    );
  }
}
export default compose(
  withState(),
  withStyles(styles)
)(Container);
