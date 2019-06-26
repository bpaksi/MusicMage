import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import { Navigation, LibraryStep, SettingsStep } from "../util/ui/navigation";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters()
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2
  }
});

class Settings extends React.Component {
  render() {
    const { artists, classes } = this.props;

    return (
      <>
        <Navigation steps={[LibraryStep, SettingsStep]}/>
        <Paper>
          <Card className={classes.card}>
            <CardHeader title="Settings" />
            <CardContent>
            </CardContent>
          </Card>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(Settings);
