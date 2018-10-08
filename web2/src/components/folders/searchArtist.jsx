import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Table, {
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableRow
  // TableSortLabel,
} from "@material-ui/core/Table";

import * as actions from "../../state/actions";

const styles = {
  root: {
    // width: "100%",
  },

  search: {
    display: "flex"
  },
  searchTextField: {
    flexGrow: 5
  },
  searchButton: {
    flexGrow: 1
  },

  results: {
    padding: 10
    // width: "100%",
  },

  table: {
    tableLayout: "auto",
  },
  tableBody: {
    // width: "100%",
    height: 100,
    overflowY: "auto"
  }
};

class SearchArtist extends React.Component {
  state = {
    artist: this.props.search.artist
  };

  onSearchAlbums = e => {
    e.stopPropagation();
    this.props.actions.searchForAlbums(this.state.artist);
  };

  onSelect = artist => {
    const { next } = this.props;
    next();
  };

  filterResults = (filter, results) => {
    return results.filter(result => {
      return result.album.startsWith(filter);
    });
  };

  render() {
    const { search, classes } = this.props;
    const filtered = this.filterResults(
      search.artistFilter,
      search.artistResults
    );

    return (
      <div className={classes.root}>
        <div className={classes.search}>
          <TextField
            className={classes.searchTextField}
            autoFocus
            margin="dense"
            id="name"
            label="Artist"
            type="text"
            fullWidth
            value={this.state.artist}
            onChange={evt => {
              this.setState({ artist: evt.target.value });
            }}
          />

          <Button
            className={classes.searchButton}
            onClick={this.onSearchAlbums}
            color="primary"
          >
            Search Artist
          </Button>
        </div>
        <div className={classes.results}>
          <TextField
            margin="dense"
            label="Filter"
            type="text"
            
            value={search.artistFilter}
            onChange={evt => {
              this.props.actions.searchArtistFilter(evt.target.value);
            }}
          />

          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="none">#</TableCell>
                <TableCell>Artist</TableCell>
                <TableCell>Album</TableCell>
                <TableCell>Source</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {filtered.map((artist, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell padding="none" numeric>
                      {idx + 1}
                    </TableCell>
                    <TableCell>{artist.artist}</TableCell>
                    <TableCell>{artist.album}</TableCell>
                    <TableCell>{artist.source}</TableCell>
                    <TableCell>
                      <a href={artist.albumURL} rel="external" target="_blank">
                        <Button>Info</Button>
                      </a>
                      <Button onClick={() => this.onSelect(artist)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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
  withStyles(styles)(SearchArtist)
);
