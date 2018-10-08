import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Header extends React.Component {
  state = {
    anchorEl: null
  };

  onMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  onMenuLibrary = () => {
    const { actions } = this.props;

    actions.navigateBack();
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
            className={classes.menuButton}
            color="inherit"
            onClick={this.onMenuOpen}
            aria-label="Menu"
            aria-owns={open ? "menu-appbar" : null}
            aria-haspopup="true"
          >
            <MenuIcon />
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
            <MenuItem onClick={this.onMenuLibrary}>Library</MenuItem>
            <MenuItem>Settings</MenuItem>
          </Menu>
          {/* <a
						href="#"
            color="inherit"
            style={{ cursor: "pointer" }}
            onClick={this.onMenuLibrary}
          > */}
            <Typography variant="title" color="inherit">
              Music Mage
            </Typography>
          {/* </a> */}
        </Toolbar>
      </AppBar>
    );
  }
}
export default compose(
  withState(),
  withStyles(styles)
)(Header);
