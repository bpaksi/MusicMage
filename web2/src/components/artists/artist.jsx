//@ts-nocheck
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from "@material-ui/core/styles";

import Card, { CardHeader, CardMedia, CardContent, CardActions } from "@material-ui/core/Card";
import Table, {
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableRow,
  // TableSortLabel,
} from "@material-ui/core/Table";
// import TextField from "@material-ui/core/TextField';
import IconButton from "@material-ui/core/IconButton";
import CloudIcon from "@material-ui/icons/Cloud";
import Tooltip from "@material-ui/core/Tooltip";
import GridField from "../util/gridField";
import Genre from "../util/genre"

import * as actions from '../../state/actions'

const styles = theme => ({
  card: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper,
  },
  media: {
    height: 194,
  },
  header: {
    fontWeight: 300,
    fontSize: 20,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    width: 200,
  },
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#3F51B5",
    color: theme.palette.common.white,
    fontSize: 20,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class Artist extends React.Component {
  componentDidMount() {
    this.props.actions.albumSubscribe(
      this.props.match.params.artist,
      this.props.match.params.album,
    );

    if (!this.props.genre.loaded) {
      this.props.actions.fetchGenres();
    }
  }

  componentWillUnmount() {
    this.props.actions.albumUnsubscribe();
  }

  onCellChanged = (attribute, song, newValue) => {
    this.props.actions.songUpdate({ ...song, [attribute]: newValue });
  }


  test = () => {
    this.props.actions.searchForAlbums("Thousand Foot Krutch")
  }

  render() {
    const { songs, classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardMedia className={classes.media}
            image="http://localhost:4000/images/default_album.jpg"
            title="Artist"
          />
        <CardHeader
          title={this.props.match.params.artist}
          subheader={this.props.match.params.album}
          action={
            <IconButton>
              <CloudIcon />
            </IconButton>
          }
        />

        <CardContent>
          <Table>
            <TableHead className={classes.header}>
              <TableRow>
                <CustomTableCell>#</CustomTableCell>
                <CustomTableCell>Artist</CustomTableCell>
                <CustomTableCell>Album</CustomTableCell>
                <CustomTableCell>Title</CustomTableCell>
                <CustomTableCell>Genre</CustomTableCell>
                <CustomTableCell numeric>Year</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songs.map((song, idx) => {
                return (
                  <TableRow className={classes.row} key={song.id}>
                    <CustomTableCell numeric>{idx + 1}</CustomTableCell>
                    <CustomTableCell>
                      <GridField contextAttrib="artist" context={song} onTextChanged={this.onCellChanged} />
                    </CustomTableCell>
                    <CustomTableCell>
                      <GridField contextAttrib="album" context={song} onTextChanged={this.onCellChanged} />
                    </CustomTableCell>
                    <CustomTableCell>
                     <GridField contextAttrib="title" context={song} onTextChanged={this.onCellChanged} />
                    </CustomTableCell>
                    <CustomTableCell>
                     <Genre contextAttrib="genre" context={song} onTextChanged={this.onCellChanged}/>
                    </CustomTableCell>
                    <CustomTableCell numeric>
                      <GridField contextAttrib="year" context={song} onTextChanged={this.onCellChanged} type="number" />
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions>
        <Tooltip id="searchCloud" title="Search music DB">
          <IconButton aria-label="Add to favorites" onClick={this.test}>
            <CloudIcon />
          </IconButton>
          </Tooltip>
        </CardActions>

      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    songs: state.songs,
    genre: state.genre,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Artist));