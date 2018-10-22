import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../util";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

class Unassigned extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="headline" component="h3">
          Unassigned
        </Typography>
      </Paper>
    );
  }
}

export default compose(
  withState(),
  withStyles(styles)
)(Unassigned);
