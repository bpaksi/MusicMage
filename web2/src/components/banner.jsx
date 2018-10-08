import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import MenuIcon from "@material-ui/icons/Dehaze";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import FolderIcon from "@material-ui/icons/Folder";

import MenuButton from "./util/menuButton2";
import MenuItemLink from "./util/menuItemLink";

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
};

const Banner = (props) => {
    const { classes } = props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <MenuButton icon={<MenuIcon />}>
              <MenuItemLink primary="Home" to="/" icon={<HomeIcon />}  />
              <MenuItemLink primary="Artists" secondary="Organize by artist name" to="/artists" icon={<PersonIcon />}  />
              <MenuItemLink primary="Folders" secondary="Organize by folders" to="/folders" icon={<FolderIcon />}  />
            </MenuButton>

            <Typography variant="title" color="inherit" className={classes.flex}>
              Music Mage
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
}

export default withStyles(styles)(Banner);