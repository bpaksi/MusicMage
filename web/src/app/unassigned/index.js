import React from "react";
import { withStyles } from "@material-ui/core/styles";

import {
  withStateScoped,
  compose,
  TableEx,
  // SelectWithChanges,
  // TextFieldWithChanges
} from "../util";

import Button from "@material-ui/core/Button";
// import MenuItem from "@material-ui/core/MenuItem";
// import TextField from "@material-ui/core/TextField";
// import Card from "@material-ui/core/Card";
// import CardHeader from "@material-ui/core/CardHeader";
// import CardActions from "@material-ui/core/CardActions";
// import CardContent from "@material-ui/core/CardContent";
// import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import Search from "./search";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

class Unassigned extends React.Component {
  state = {searchOpen: false};

  componentDidMount() {
    const { actions } = this.props;

    actions.unassignedSubscribe();
  }
  componentWillUnmount() {
    const { actions } = this.props;

    actions.unassignedUnsubscribe();
  }

  onSearch = () => {
    this.setState({searchOpen: true});
  };
  onSearchClose = () => {
    this.setState({searchOpen: false});
  };

  render() {
    const { unassigned } = this.props;
    const { searchOpen } = this.state;

    console.log("Unassigned - render", unassigned);

    const columns = [
      { id: "id", label: "id", render: ({ id }) => id },
      { id: "fullpath", label: "fullpath", render: ({ fullpath }) => fullpath },
      {
        id: "suggestedArtist",
        label: "suggestedArtist",
        render: ({ suggestedArtist }) => suggestedArtist
      },
      {
        id: "suggestedAlbum",
        label: "suggestedAlbum",
        render: ({ suggestedAlbum }) => suggestedAlbum
      },
      {
        id: "suggestedTitle",
        label: "suggestedTitle",
        render: ({ suggestedTitle }) => suggestedTitle
      },
      { id: "album", label: "Album", render: ({ album }) => album },
      { id: "artist", label: "artist", render: ({ artist }) => artist },
      { id: "title", label: "title", render: ({ title }) => title }
    ];

    return (
      <>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Unassigned
          </Typography>
          <Button onClick={this.onSearch}>Search</Button>
        </Toolbar>

        <TableEx data={unassigned} columns={columns} />

        <Search open={searchOpen} onClose={this.onSearchClose} />
      </>
    );
  }
}

export default compose(
  withStateScoped("unassigned"),
  withStyles(styles)
)(Unassigned);
