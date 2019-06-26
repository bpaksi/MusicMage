import React from "react";
import { withStyles } from "@material-ui/core/styles";

import {
  withStateScoped,
  compose,
  TableEx
  // SelectWithChanges,
  // TextFieldWithChanges
} from "../util";

import Paper from "@material-ui/core/Paper";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

import Navigation from "../util/ui/navigation";
import { routes } from "../routes";

import Search from "./search";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters()
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2
  }
});

class Unassigned extends React.Component {
  state = { searchOpen: false };

  componentDidMount() {
    const { actions } = this.props;

    actions.unassignedSubscribe();
  }
  componentWillUnmount() {
    const { actions } = this.props;

    actions.unassignedUnsubscribe();
  }

  onSearch = () => {
    this.setState({ searchOpen: true });
  };
  onSearchClose = () => {
    this.setState({ searchOpen: false });
  };

  render() {
    const { unassigned } = this.props;
    const { searchOpen } = this.state;

    console.log("Unassigned - render", unassigned);

    const columns = [
      { id: "path", label: "Path", render: ({ relPath, fileName }) => relPath + "/" + fileName },
      {
        id: "suggestedArtist",
        label: "Suggested Artist",
        render: ({ suggestedArtist }) => suggestedArtist
      },
      {
        id: "suggestedAlbum",
        label: "Suggested Album",
        render: ({ suggestedAlbum }) => suggestedAlbum
      },
      {
        id: "suggestedTitle",
        label: "Suggested Title",
        render: ({ suggestedTitle }) => suggestedTitle
      },
      { id: "album", label: "Album", render: ({ album }) => album },
      { id: "artist", label: "Artist", render: ({ artist }) => artist },
      { id: "title", label: "Title", render: ({ title }) => title }
    ];

    return (
      <>
        <Navigation steps={[routes.library.nav(), routes.unassigned.nav()]} />
        <Paper>
          <Card>
            <CardHeader
              action={
                <IconButton aria-label="Search" onClick={this.onSearch}>
                  <SearchIcon />
                </IconButton>
              }
              title="Unassigned"
              // subheader="September 14, 2016"
            />
            <CardContent>
              <TableEx data={unassigned.all} columns={columns} />
            </CardContent>
          </Card>
        </Paper>
        <Search open={searchOpen} onClose={this.onSearchClose} />
      </>
    );
  }
}

export default compose(
  withStateScoped("unassigned"),
  withStyles(styles)
)(Unassigned);
