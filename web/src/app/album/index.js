import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";

import Button from "@material-ui/core/Button";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Song from "./song";

const styles = theme => ({
  card: {},
  table: {}
});

class Artist extends React.Component {
  state = { dirty: {} };

  componentDidMount() {
    const { artistName, albumName, actions } = this.props;

    actions.albumSubscribe(artistName, albumName);
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.albumUnsubscribe();
  }

  changeHandler = idx => (field, value) => {
    this.setState(state => {
      const dirty = { ...state.dirty };
      dirty[idx] = { ...dirty[idx], [field]: value };

      return { dirty };
    });
  };

  render() {
    const { artistName, albumName, songs, classes } = this.props;
    const { dirty } = this.state;

    // console.log("Album - render", {artistName, albumName, props: this.props})

    return (
      <Card className={classes.card}>
        <CardHeader title={artistName} subheader={albumName} />
        <CardContent>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell  numeric />
                <TableCell >Artist</TableCell>
                <TableCell >Album</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell numeric>Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songs.map(song => (
                <Song
                  key={song.id}
                  song={song}
                  edits={dirty[song.id] || {}}
                  onChange={this.changeHandler(song.id)}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions disableActionSpacing>
          <Button size="small" color="primary">
            Save
          </Button>
          <Button size="small" color="secondary">
            Cancel
          </Button>
        </CardActions>
      </Card>
    );
  }
}

Artist.propTypes = {
  artistName: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired
};

export default compose(
  withState(),
  withStyles(styles)
)(Artist);
