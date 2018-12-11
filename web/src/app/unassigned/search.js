import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose } from "../util";

import Drawer from "@material-ui/core/Drawer";

const drawerWidth = 250

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  }
});

class Search extends React.Component {
  onSearch = () => {
    const { searchForAlbums } = this.props.actions;
    searchForAlbums("Our Lady Peace");
  };

  render() {
    const { classes, open } = this.props;

    console.log("Search - render", this.props);

    return (
      <Drawer
        className={classes.drawer}
        // variant="persistent"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      />
    );
  }
}

Search.propTypes = {
  open: PropTypes.object.isRequired
};

export default compose(
  withStateScoped("unassigned"),
  withStyles(styles)
)(Search);
