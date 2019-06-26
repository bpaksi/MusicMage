import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const drawerWidth = 250;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  }
});

class Settings extends React.Component {
  render() {
    const { classes, open, onClose } = this.props;

    return (
      <Drawer
        className={classes.drawer}
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Card className={classes.card}>
          <CardHeader
            title="Settings"
            action={
              <IconButton aria-label="Close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <em>Application Settings</em>
          </CardContent>
        </Card>
      </Drawer>
    );
  }
}

Settings.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(Settings);
