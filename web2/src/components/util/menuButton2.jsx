import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import Menu from "@material-ui/core/Menu";

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class MenuButton2 extends React.Component {
  state = {
    anchorEl: null
  };

  onMenuToggle = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, icon } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
          onClick={this.onMenuToggle}
        >
          {icon}
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.onMenuClose}
        >
          {this.props.children}
        </Menu>
      </div>
    );
  }
}

MenuButton2.propTypes = {
  icon: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuButton2);
