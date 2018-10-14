import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({});

class Artist extends React.Component {
  componentDidMount() {
    const { artistName, albumName, actions } = this.props;

    actions.albumSubscribe(artistName, albumName);
	}
	
  componentWillUnmount() {
    const { actions } = this.props;

    actions.albumUnsubscribe();
  }

  render() {
    const { artistName, albumName, classes } = this.props;

// console.log("Album - render", {artistName, albumName, props: this.props})


    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="headline" component="h3">
          {"Artist " + artistName + " " + albumName}
        </Typography>
      </Paper>
    );
  }
}

Artist.propTypes = {
  artistName: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired
};

const fromState = (state,{artistId}) => (
	{artist: state.artists.find(i => i.id === artistId)}
)

export default compose(
  withState(),
  withStyles(styles)
)(Artist);
