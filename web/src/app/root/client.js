import React from "react";
import { withStyles } from "@material-ui/core/styles";

// import Slide from "@material-ui/core/Slide";
import Paper from "@material-ui/core/Paper";

import { routes } from "../routes";

const styles = theme => ({
  paper: {
    margin: "5px"
  }
});

class Client extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        {Object.keys(routes).filter(k => routes[k].router).map(k => routes[k].router())}
      </Paper>
    );
  }
}

export default withStyles(styles)(Client);
