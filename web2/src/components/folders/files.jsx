import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Table, {
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableRow
  // TableSortLabel,
} from "@material-ui/core/Table";
import Checkbox from "@material-ui/core/Checkbox";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as actions from "../../state/actions";

import GridField from "../util//gridField";
import Search from "./search";

class Files extends React.Component {
  onSearch = () => {
    this.props.actions.searchOpen("Thousand Foot Krutch", "");
  };

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
          <Button onClick={this.onSearch}>Search for Music</Button>
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
              <TableCell>Artist</TableCell>
              <TableCell>Album</TableCell>
              <TableCell>Title</TableCell>
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
                  <TableCell padding="none" numeric>
                    {idx + 1}
                  </TableCell>
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
        <Search />
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
