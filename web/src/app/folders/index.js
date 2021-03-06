import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2
  }
});

class Folders extends React.Component {
  componentDidMount() {
    const { actions } = this.props;

    // actions.artistSubscribe();
  }
  componentWillUnmount() {
    const { actions } = this.props;

    // actions.artistUnsubscribe();
  }

  render() {
    const { artists, classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader title="Folders" />
        <CardContent>
        </CardContent>
      </Card>
    );
  }
}

export default compose(
  withState(),
  withStyles(styles)
)(Folders);
