import React from "react";
// import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  withState,
  compose,
  TableEx,
  SelectWithChanges,
  TextFieldWithChanges
} from "../util";

// import MenuItem from "@material-ui/core/MenuItem";
// import TextField from "@material-ui/core/TextField";

import Paper from "@material-ui/core/Paper";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

import Navigation from "../util/ui/navigation";
import { routes } from "../routes";

import AddGenre from "./addGenre";

const styles = theme => ({
  card: {},
  table: {}
});

class Artist extends React.Component {
  state = { addGenre: undefined };

  componentDidMount() {
    const { match, actions } = this.props;
    const { artist, album } = match.params;

    actions.albumSubscribe(artist, album);
    actions.genresSubscribe();
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.albumUnsubscribe();
    actions.genresUnsubscribe();
  }

  componentDidUpdate() {}

  onSave = () => {
    const { actions } = this.props;

    actions.songsSaveChanges();
  };

  onCancel = () => {
    const { actions } = this.props;

    actions.songUndoAll();
  };

  onChange = (value, { id, field }) => {
    const { actions } = this.props;

    actions.songChange(id, field, value);
  };

  onGenreChange = (value, data) => {
    console.log("onGenreChange", value);

    if (value === "*add") {
      this.setState({ addGenre: data });
      return;
    }

    this.onChange(value, data);
  };

  onUndo = ({ id, field }) => {
    const { actions } = this.props;

    actions.songUndo(id, field);
  };

  onAddGenreSuccess = newGenre => {
    const { addGenre } = this.state;
    this.onChange(newGenre, addGenre);

    this.setState({ addGenre: undefined });
  };

  onAddGenreClose = () => {
    this.setState({ addGenre: undefined });
  };

  render() {
    const { match, songs, genres, classes } = this.props;
    const { addGenre } = this.state;
    const { artist, album } = match.params;

    console.log("Album - render", {
      artist,
      album,
      props: this.props
    });

    const columns = [
      // {
      //   id: "id",
      //   numeric: true,
      //   render: ({ song }) => song.id
      // },
      {
        id: "artist",
        label: "Artist",
        render: song => song.artist
      },
      {
        id: "album",
        label: "Album",
        render: song => song.album
      },
      {
        id: "title",
        label: "Title",
        render: song => (
          <TextFieldWithChanges
            value={song.title}
            fullWidth={true}
            data={{ id: song.id, field: "title" }}
            onChange={this.onChange}
            onUndo={this.onUndo}
            dirty={song.dirtyFields.includes("title")}
          >
            song.title
          </TextFieldWithChanges>
        )
      },
      {
        id: "genre",
        label: "Genre",
        render: song => (
          <SelectWithChanges
            fullWidth
            value={song.genre}
            data={{ id: song.id, field: "genre" }}
            onChange={this.onGenreChange}
            onUndo={this.onUndo}
            dirty={song.dirtyFields.includes("genre")}
          >
            {genres.all.map(genre => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem value="*add">Add new ...</MenuItem>
          </SelectWithChanges>
        )
      },
      {
        id: "year",
        label: "Year",
        numeric: true,
        render: song => (
          <TextFieldWithChanges
            value={song.year}
            type="number"
            fullWidth={true}
            data={{ id: song.id, field: "year" }}
            onChange={this.onChange}
            onUndo={this.onUndo}
            dirty={song.dirtyFields.includes("year")}
          >
            song.title
          </TextFieldWithChanges>
        )
      }
    ];

    return (
      <>
        <Navigation
          steps={[routes.library.nav(), routes.artists.nav, routes.album.nav(artist, album)]}
        />
        <Paper>
          <Card className={classes.card}>
            <CardHeader title={artist} subheader={album} />
            <CardContent>
              <TableEx data={songs.all} columns={columns} />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                disabled={!songs.hasChanges}
                onClick={this.onSave}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={!songs.hasChanges}
                onClick={this.onCancel}
              >
                Cancel
              </Button>
            </CardActions>
            <AddGenre
              open={addGenre !== undefined}
              onSuccess={this.onAddGenreSuccess}
              onClose={this.onAddGenreClose}
            />
          </Card>
        </Paper>
      </>
    );
  }
}

export default compose(
  withState(),
  withStyles(styles)
)(Artist);
