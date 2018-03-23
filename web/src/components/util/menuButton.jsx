import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';

import { MenuList } from 'material-ui/Menu';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuButton extends React.Component {
  state = {
    open: false,
  };
  
  onMenuOpen = event => {
    this.setState({ open: true });
  };

  onMenuClose = () => {
    this.setState({ open: false });
  };  
  render() {
    const {classes, icon} = this.props;
    const {open} = this.state;
    
    return (
      <Manager>
        <Target>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.onMenuOpen}>
            {icon}
          </IconButton>
        </Target>
        <Popper placement="bottom-start" eventsEnabled={open}>
          <ClickAwayListener onClickAway={this.onMenuClose}>
            <Grow in={open}>
              <Paper>
                <MenuList role="menu" onClick={this.onMenuClose}>
                  {this.props.children}
                </MenuList>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    );
  }
}

MenuButton.propTypes = {
  icon: PropTypes.object.isRequired,
};


export default withStyles(styles)(MenuButton);