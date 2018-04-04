import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import TextField from 'material-ui/TextField';
import * as actions from "../../state/actions";

const styles = {};

class SearchAlbum extends React.Component {
  state = {
    artist: this.props.search.artist,
  };

  onSearchAlbums = (e) =>{
    e.stopPropagation();

    this.props.actions.searchForAlbums(this.state.artist);
  }

  render() {
    return (

      <div>
        Search for Album
      </div>
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
  withStyles(styles)(SearchAlbum)
);