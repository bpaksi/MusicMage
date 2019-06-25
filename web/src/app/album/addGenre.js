import React from "react";
import PropTypes from "prop-types";
import { withActionsOnly } from "../util";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";

class AddGenre extends React.Component {
  state = { genre: "" };

  onSave = () => {
    const { onSuccess, actions } = this.props;
    const { genre } = this.state;

    actions.genreAdd(genre);
    onSuccess(genre);
  };

  handleChange = e => {
    this.setState({ genre: e.target.value });
  };

  render() {
    const { open, onClose } = this.props;
    const { genre } = this.state;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Genre</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Genre"
            value={genre}
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onSave} color="primary" disabled={genre === ""}>
            Add
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

AddGenre.propTypes = {
  open: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withActionsOnly()(AddGenre);
