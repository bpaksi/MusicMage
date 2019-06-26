import React from "react";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Navigation from "../util/ui/navigation";
import { routes } from "../routes";

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
        <Navigation steps={[routes.library.nav(), routes.settings.nav()]}/>
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
