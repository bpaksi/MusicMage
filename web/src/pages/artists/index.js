import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

class Library extends React.Component {
  componentDidMount() {
    const { actions } = this.props;

    actions.artistSubscribe();
  }
  componentWillUnmount() {
    const { actions } = this.props;

    actions.artistUnsubscribe();
  }

  onClick = artist => {
    const { actions } = this.props;

    actions.navigateTo("album", { artist: artist.name, album: artist.albumName });
  };

  render() {
    const { artists, classes } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="headline" component="h3">
          Artists
        </Typography>
        <List>
          {artists.map(artist => (
            <ListItem key={artist.id}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={artist.name}
                secondary={artist.albumName}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => this.onClick(artist)}>
                  <ChevronRightIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
}

export default compose(
  withState(),
  withStyles(styles)
)(Library);
