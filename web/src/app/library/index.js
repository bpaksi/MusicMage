import React from "react";
import { Link } from "react-router-dom";

import { withActionsOnly } from "../util";

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
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { routes } from "../routes";

import { Navigation, LibraryStep } from "../util/ui/navigation";

const Library = props => {
  // console.log("Library.render()", props)

  return (
    <>
      <Navigation steps={[LibraryStep]}/>
      <Paper>
        <Card>
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
                        <IconButton component={Link} to={routes[route].path}>
                          <ChevronRightIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
              )}
            </List>
          </CardContent>
        </Card>
      </Paper>
    </>
  );
};

export default withActionsOnly()(Library);
