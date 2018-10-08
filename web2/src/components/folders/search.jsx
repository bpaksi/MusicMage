import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core/Dialog";
// import TextField from "@material-ui/core/TextField";
import Stepper, { Step, StepLabel } from "@material-ui/core/Stepper";

import SearchArtist from "./searchArtist";
import SearchAlbum from "./searchAlbum";

// import Paper from "@material-ui/core/Paper";
import * as actions from "../../state/actions";

const styles = {
  // dialog: {
  //   width: 850,
  //   height: 750,
  // },
  content: {
    // width: 850,
    height: 750
  }
};
const steps = [
  { label: "Artist", render: props => <SearchArtist {...props} /> },
  { label: "Album", render: props => <SearchAlbum {...props} /> }
];

class Search extends React.Component {
  state = {
    step: 0,
    artist: "",
    album: ""
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      artist: nextProps.search.artist,
      album: nextProps.search.album
    };
  }

  onNext = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  onBack = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  render() {
    const { search, classes } = this.props;
    const { step } = this.state;

    return (
      <Dialog
        fullWidth
        maxWidth={false}
        open={search.open}
        onClose={this.props.actions.searchClose}
      >
        <DialogTitle>Search for Music</DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText />
          <Stepper activeStep={step} alternativeLabel>
            {steps.map(step => {
              return (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {steps[step].render({ back: this.onBack, next: this.onNext })}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.props.actions.searchClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  return {
    search: state.search
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Search)
);
