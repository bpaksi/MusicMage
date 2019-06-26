import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import { routes } from "../routes";

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Header extends React.Component {
  state = { anchorEl: null };

  onMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  onOptionLibrary = () => {
    const { history } = this.props;

    // actions.navigateBack();
    history.push(routes.library.path);
    this.setState({ anchorEl: null });
  };

  onOptionSettings = () => {
    const { history } = this.props;

    // actions.navigateBack();
    history.push(routes.settings.path);
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
					size="large"
            className={classes.menuButton}
            color="inherit"
            onClick={this.onMenuOpen}
            aria-label="Menu"
            aria-owns={open ? "menu-appbar" : null}
            aria-haspopup="true"
          >
            <Icon fontSize="large">menu</Icon>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={open}
            onClose={this.onMenuClose}
          >
            <MenuItem onClick={this.onOptionLibrary}>
              <ListItemIcon>
                <Icon>{routes.library.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary="Library" />
            </MenuItem>
            <MenuItem onClick={this.onOptionSettings}>
              <ListItemIcon>
                <Icon>{routes.settings.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
          </Menu>
          <Typography variant="h1" color="inherit">
            Music Mage
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}
export default withStyles(styles)(withRouter(Header));
