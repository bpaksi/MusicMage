// import React from "react";

// import { withStyles } from "@material-ui/core/styles";
// import Snackbar from "@material-ui/core/Snackbar";
// import IconButton from "@material-ui/core/IconButton";
// import CloseIcon from "@material-ui/icons/Close";

// import { NotifyStatuses } from "../../state/constants";
// import * as actions from "../../state/actions";

// const styles = theme => ({
//   default: {},
//   error: {
//     backgroundColor: "red"
//   },
//   success: {
//     backgroundColor: "green"
//   },
//   close: {
//     width: theme.spacing.unit * 4,
//     height: theme.spacing.unit * 4
//   }
// });

// class Notify extends React.Component {
//   onClose = () => {
//     const { dispatch } = this.props;
    
//     dispatch(actions.notifyClose());
//   };

//   render() {
//     const { notify, classes } = this.props;
//     const className =
//       notify.status === NotifyStatuses.SUCCESS
//         ? classes.success
//         : notify.status === NotifyStatuses.ERROR
//           ? classes.error
//           : classes.default;
//     const duration = notify.status === NotifyStatuses.ERROR ? 10000 : 3000;

//     return (
//       <Snackbar
//         open={notify.open}
//         message={notify.message}
//         autoHideDuration={duration}
//         onClose={this.onClose}
//         SnackbarContentProps={{
//           classes: {
//             root: className
//           }
//         }}
//         action={[
//           <IconButton
//             key="close"
//             aria-label="Close"
//             color="inherit"
//             className={classes.close}
//             onClick={this.onClose}
//           >
//             <CloseIcon />
//           </IconButton>
//         ]}
//       />
//     );
//   }
// }


// export default withStyles(styles)(Notify);
