import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";

import Paper from "material-ui/Paper";
import * as actions from "../../state/actions";

class Search extends React.Component {
  render() {
    return (
      <Paper className={"folders"}>
        <Typography variant="title" color="primary" gutterBottom={true}>
          Search
        </Typography>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    folders: state.folders
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
