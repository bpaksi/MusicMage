import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import Stepper, { Step, StepLabel } from 'material-ui/Stepper';


import SearchArtist from "./searchArtist";
import SearchAlbum from "./searchAlbum";

// import Paper from "material-ui/Paper";
import * as actions from "../../state/actions";

const styles = {};

class Search extends React.Component {
  state = {
    step: 0,
    artist: this.props.search.artist,
    album: this.props.search.album
  };

  onTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { search } = this.props;
    const { artist, tab } = this.state;
    console.log("search: ", search);
    console.log("tab: ", tab);

    return (
      <Dialog open={search.open} onClose={this.props.actions.searchClose}>
        <DialogTitle>Search for Music</DialogTitle>
        <DialogContent>
          <DialogContentText />
          {/* <Stepper activeStep={activeStep}>
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
        </Stepper>
          {tab === "artist" && <SearchArtist />}
          {tab === "album" && <SearchAlbum />} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.actions.searchClose} color="primary">
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
