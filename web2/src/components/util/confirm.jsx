import React from "react";
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core/Dialog";
import * as actions from "../../state/actions";

class Confirm extends React.Component {
  onConfirm = () => {
    const { confirm, dispatch } = this.props;

    dispatch(confirm.onConfirm());
  };

  onClose = () => {
    const { dispatch } = this.props;

    dispatch(actions.confirmClose());
  };

  render() {
    const { confirm } = this.props;

    return (
      <Dialog open={confirm.open} onClose={this.onClose}>
        <DialogTitle>{confirm.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span dangerouslySetInnerHTML={{ __html: confirm.body }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Confirm.propTypes = {
  confirm: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Confirm;
