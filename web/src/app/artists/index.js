import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose, IconButtonEx } from "../util";

// import IconButton from "@material-ui/core/IconButton";

import Paper from "@material-ui/core/Paper";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { Navigation, LibraryStep, ArtistsStep } from "../util/ui/navigation";


const styles = theme => ({
  root: {
    ...theme.mixins.gutters()
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2
  }
});

class Artists extends React.Component {
  componentDidMount() {
    const { actions } = this.props;

    actions.artistSubscribe();
  }
  componentWillUnmount() {
    const { actions } = this.props;

    actions.artistUnsubscribe();
  }

  render() {
    const { artists, classes } = this.props;

    return (
      <>
        <Navigation steps={[LibraryStep, ArtistsStep]}/>
        <Paper>
          <Card className={classes.card}>
            <CardHeader title="Artists" />
            <CardContent>
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
                      <IconButtonEx
                        data={artist}
                        component={Link}
                        to={"/album/" + artist.name + "/" + artist.albumName}
                      >
                        <ChevronRightIcon />
                      </IconButtonEx>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Paper>
      </>
    );
  }
}

export default compose(
  withStateScoped("artists"),
  withStyles(styles)
)(Artists);
