import React from 'react';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import MenuIcon from 'react-material-icons/icons/image/dehaze';
import HomeIcon from 'react-material-icons/icons/action/home';
import PersonIcon from 'react-material-icons/icons/social/person';
import FolderIcon from 'react-material-icons/icons/file/folder';

import MenuButton from './util/menuButton'
import MenuItemLink from './util/menuItemLink'

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