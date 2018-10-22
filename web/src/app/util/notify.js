import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose } from "./withState";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  default: {},
  error: {
    backgroundColor: "red"
  },
  success: {
    backgroundColor: "green"
  },
  close: {
    padding: theme.spacing.unit / 2
  }
});

class Notify extends React.Component {
  onClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    const { actions } = this.props;
    actions.notifyClose();
  };

  onExited = () => {
    const { actions } = this.props;
    actions.notifyExit();
  };

  render() {
    const { notify, classes } = this.props;
    var className;
    var duration;
    var messageTxt;

    if (notify.messages.length > 0) {
      const message = notify.messages[0];
      className = classes[message.type || "default"];
      duration = message.type === "error" ? 6000 : 3000;
      messageTxt = message.message;
    }

    return (
      <Snackbar
        open={notify.open}
        message={messageTxt}
        autoHideDuration={duration}
        onClose={this.onClose}
        onExited={this.onExited}
        ContentProps={{
          classes: {
            root: className
          }
        }}
        action={[
          <IconButton
            key="close"
            color="inherit"
            className={classes.close}
            onClick={this.onClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

export default compose(
  withStateScoped("notify"),
  withStyles(styles)
)(Notify);
