import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "./withState";

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
    padding: theme.spacing.unit / 2,
  }
});

class Notify extends React.Component {
  render() {
		const { notify, classes, actions } = this.props;
	

		// var open = false
		var className = classes.success
    var duration = 3000;
		
		// if (notify.message.length > 0)
		// {

		// }
    //   notify.type === "success"
    //     ? 
    //     : notify.type === "error"
    //       ? classes.error
    //       : classes.default;

    return (
      <Snackbar
        open={notify.open}
        message={notify.message}
        autoHideDuration={duration}
        onClose={this.onClose}
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
            onClick={actions.notifyClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}


export default compose(
  withState(),
  withStyles(styles)
)(Notify);
