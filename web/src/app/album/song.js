import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../withState";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import { EditField } from "../util";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  textField: {}
});

class Song extends React.Component {
  changeHandler = name => e => {
    const { onChange } = this.props;

    onChange(name, e.target.value);
  };

  render() {
    const { song, edits } = this.props;
    const edited = { ...song, ...edits };

    // console.log("Song - render", { song, edits });

    return (
      <TableRow key={song.id}>
        <TableCell  numeric>{song.id}</TableCell>
        <TableCell >{song.artist}</TableCell>
        <TableCell >{song.album}</TableCell>


        <TableCell>
          <EditField
            value={edited.title}
            isDirty={"title" in edits}
            onChange={this.changeHandler("title")}
          />
        </TableCell>
        <TableCell>
          <EditField
            value={edited.genre}
            isDirty={"genre" in edits}
            onChange={this.changeHandler("genre")}
          />
        </TableCell>
        <TableCell numeric>
          <EditField
						value={edited.year}
						type="number"
            isDirty={"year" in edits}
            onChange={this.changeHandler("year")}
          />
        </TableCell>
      </TableRow>
    );
  }
}

Song.propTypes = {
  song: PropTypes.object.isRequired,
  edits: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default compose(
  withState(),
  withStyles(styles)
)(Song);
