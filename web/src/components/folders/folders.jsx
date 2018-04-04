import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Typography from "material-ui/Typography";
// import { withStyles } from "material-ui/styles";
// import Table, {
//   TableBody,
//   TableCell,
//   // TableFooter,
//   TableHead,
//   TableRow
//   // TableSortLabel,
// } from "material-ui/Table";

// import Paper from "material-ui/Paper";
import Folder from "./folder";
import * as actions from "../../state/actions";
// import GridField from "../util//gridField";
// import Genre from "../util/genre";
// import Grid from "material-ui/Grid";


class Folders extends React.Component {
  componentWillMount() {
    this.props.actions.fetchFolders();
  }

  render() {
    const { folders } = this.props;

    if (folders.length === 0) {
      return <span>No folders found</span>;
    }

    return (
          <div className={"folders"}>
            <Typography variant="title" color="primary" gutterBottom={true}>
              Folders
            </Typography>
            {folders.all.map(folder => (
              <Folder
                key={folder._id}
                folder={folder}
                selectedId={folders.selected}
                onSelect={this.props.actions.selectFolder}
              />
            ))}
          </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    folders: state.folders,
  };
};

const mapDispatchToProps = dispatch => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
