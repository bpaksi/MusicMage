import React from 'react';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import * as actions from '../../state/actions'

class Confirm extends React.Component {
  onConfirm = () => {
    const { confirm } = this.props;

    this.props.dispatch(confirm.onConfirm());
  }

  onClose = () => {
    this.props.dispatch(actions.confirmClose());
  }

  render() {
    const { confirm } = this.props;

    return (
      <Dialog
        open={confirm.open}
        onClose={this.onClose}
      >
        <DialogTitle>
          {confirm.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span dangerouslySetInnerHTML={{ __html: confirm.body }}></span>
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
    )
  }
}

export default connect()(Confirm);