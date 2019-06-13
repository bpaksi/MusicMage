import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  withStateScoped,
  compose,
  TableEx,
  SelectWithChanges,
  TextFieldWithChanges
} from "../util";

import Button from "@material-ui/core/Button";
// import MenuItem from "@material-ui/core/MenuItem";
// import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";

// import Song from "./song";

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

  componentDidUpdate() {
    const { songs } = this.props;
    const dirty = { ...this.state.dirty };

    var updated = false;
    Object.keys(dirty).forEach(songId => {
      var songUpdated = false;
      const dirtySong = { ...dirty[songId] };
      const dirtySongFields = Object.keys(dirtySong);
      if (dirtySongFields.length === 0) {
        delete dirty[songId];
        updated = true;
      } else {
        const song = songs.find(i => i.id === parseInt(songId));
        console.log("song: ", { songId, song, songs });

        dirtySongFields.forEach(field => {
          if (dirtySong[field] === song[field]) {
            delete dirtySong[field];
            songUpdated = true;
          }
        });

        if (songUpdated) {
          dirty[songId] = dirtySong;
          updated = true;
        }
      }
    });

    if (updated) {
      this.setState({ dirty });
    }
  }

  onChange = (value, { id, field }) => {
    console.log("onChange", { id, field, value });

    this.setState(state => {
      const dirty = { ...state.dirty };
      dirty[id] = { ...dirty[id], [field]: value };

      console.log("Artist - onChange", { id, field, value });
      return { dirty };
    });
  };

  onUndo = ({ id, field }) => {
    this.setState(state => {
      const dirty = { ...state.dirty };
      const { [field]: _, ...dirtySong } = dirty[id];
      dirty[id] = dirtySong;
      return { dirty };
    });
  };

  onRowProps = song => {
    const { dirty } = this.state;
    const dirtySong = dirty[song.id] || {};

    return {
      song: { ...song, ...dirtySong },
      dirty: field => field in dirtySong
    };
  };

  render() {
    const { artistName, albumName, songs, classes } = this.props;
    const { dirty } = this.state;

    console.log("Album - render", {
      artistName,
      albumName,
      props: this.props,
      dirty
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
        render: ({ song }) => song.artist
      },
      {
        id: "album",
        label: "Album",
        render: ({ song }) => song.album
      },
      {
        id: "title",
        label: "Title",
        render: ({ song, dirty }) => (
          <TextFieldWithChanges
            value={song.title}
            fullWidth={true}
            data={{ id: song.id, field: "title" }}
            onChange={this.onChange}
            onUndo={this.onUndo}
            dirty={dirty("title")}
          >
            song.title
          </TextFieldWithChanges>
        )
      },
      {
        id: "genre",
        label: "Genre",
        render: ({ song, dirty }) => (
          <SelectWithChanges
            native
            value={song.genre}
            data={{ id: song.id, field: "genre" }}
            onChange={this.onChange}
            onUndo={this.onUndo}
            dirty={dirty("genre")}
          >
            <option />
            <option>Rock</option>
            <option>Classic</option>
						<option>Metal</option>
          </SelectWithChanges>
        )
      },
      {
        id: "year",
        label: "Year",
        numeric: true,
        render: ({ song, dirty }) => (
          <TextFieldWithChanges
            value={song.year}
            type="number"
            fullWidth={true}
            data={{ id: song.id, field: "year" }}
            onChange={this.onChange}
            onUndo={this.onUndo}
            dirty={dirty("year")}
          >
            song.title
          </TextFieldWithChanges>
        )
      }
    ];

    return (
      <Card className={classes.card}>
        <CardHeader title={artistName} subheader={albumName} />
        <CardContent>
          <TableEx
            data={songs}
            columns={columns}
            onRowProps={this.onRowProps}
          />
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
  withStateScoped("songs"),
  withStyles(styles)
)(Artist);
