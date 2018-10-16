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
import Icon from "@material-ui/core/Icon";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { routes } from "../routes";

const styles = theme => ({
  card: {
  }
});

class Library extends React.Component {
  render() {
    const { classes, actions } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader title="Library" />
        <CardContent>
					<List>
          {Object.keys(routes).map(
            route =>
              routes[route].menu && (
                <ListItem key={route}>
                  {routes[route].icon && (
                    <ListItemAvatar>
                      <Avatar>
                        <Icon>{routes[route].icon}</Icon>
                      </Avatar>
                    </ListItemAvatar>
                  )}
                  <ListItemText primary={routes[route].label} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => actions.navigateTo(route)}>
                      <ChevronRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
					)}
					</List>
        </CardContent>
      </Card>
    );
  }
}

export default compose(
  withState(),
  withStyles(styles)
)(Library);
