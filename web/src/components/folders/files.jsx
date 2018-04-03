import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableRow
  // TableSortLabel,
} from "material-ui/Table";
import Checkbox from "material-ui/Checkbox";
import Paper from "material-ui/Paper";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";

// import Folder from "./folder";
import * as actions from "../../state/actions";

import GridField from "../util//gridField";
// import Genre from "../util/genre";
// import Grid from "material-ui/Grid";


class Files extends React.Component {
  render() {
    const { folders } = this.props;

    if (folders.length === 0) {
      return <span>No folders found</span>;
    }

    return (
      <div>
              <Toolbar>
                <Typography variant="title" color="primary" gutterBottom={true}>
                  Files
                </Typography>
                <Button>Search for Music</Button>
              </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell padding="checkbox">
                    <Checkbox
                    // indeterminate={numSelected > 0 && numSelected < rowCount}
                    // checked={numSelected === rowCount}
                    // onChange={onSelectAllClick}
                    />
                  </TableCell>              
              <TableCell padding="none">#</TableCell>
              <TableCell padding="dense">Filename</TableCell>
              <TableCell >Artist</TableCell>
              <TableCell >Album</TableCell>
              <TableCell >Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folders.files.map((file, idx) => {
              return (
                <TableRow key={file.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                    // indeterminate={numSelected > 0 && numSelected < rowCount}
                    // checked={numSelected === rowCount}
                    // onChange={onSelectAllClick}
                    />
                  </TableCell>
                  <TableCell padding="none" numeric>{idx + 1}</TableCell>
                  <TableCell padding="dense">{file.filename}</TableCell>
                  <TableCell>
                    <GridField
                      contextAttrib="artist"
                      context={file}
                      // onTextChanged={this.onCellChanged}
                    />
                  </TableCell>
                  <TableCell>
                    <GridField
                      contextAttrib="album"
                      context={file}
                      // onTextChanged={this.onCellChanged}
                    />
                  </TableCell>
                  <TableCell>
                    <GridField
                      contextAttrib="title"
                      context={file}
                      // onTextChanged={this.onCellChanged}
                    />
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
    folders: state.folders
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Files);
