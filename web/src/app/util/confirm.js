import React from "react";
import { withStateScoped } from "./withState";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const Confirm = ({ confirm, actions }) => (
  <Dialog open={confirm.open} onClose={actions.confirmCanceled}>
    <DialogTitle>{confirm.title}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        <span dangerouslySetInnerHTML={{ __html: confirm.body }} />
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={actions.confirmCanceled} color="primary">
        Cancel
      </Button>
      <Button onClick={actions.confirmConfirmed} color="primary" autoFocus>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

export default withStateScoped("confirm")(Confirm);
