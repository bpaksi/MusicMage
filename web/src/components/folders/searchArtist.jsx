import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Table, {
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableRow
  // TableSortLabel,
} from "material-ui/Table";

import * as actions from "../../state/actions";

const styles = {};

class SearchArtist extends React.Component {
  state = {
    artist: this.props.search.artist
  };

  onSearchAlbums = e => {
    e.stopPropagation();

    this.props.actions.searchForAlbums(this.state.artist);
  };

  render() {
    const {search} = this.props; 

    return (
      <div>
        <TextField
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

        <Button onClick={this.onSearchAlbums} color="primary">
          Search Artist
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none">#</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Album</TableCell>
              <TableCell>Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {search.artistResults.map((artist, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell padding="none" numeric>
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    {artist.album}
                  </TableCell>
                    {artist.name}
                  <TableCell>
                    <a href={artist.url} rel="external" target="_blank">
                      <Button>
                        Info
                      </Button>
                    </a>
                    
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

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
