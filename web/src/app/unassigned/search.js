import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose } from "../util";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";

const drawerWidth = 250;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  }
});

class Search extends React.Component {
  state = { artistName: "Our Lady Peace" };

  onSearch = () => {
    const { actions } = this.props;
    const { artistName } = this.state;

    actions.searchForAlbums(artistName);
  };

  onClose = () => {
    const { onClose } = this.props;

    onClose();
  };

  onTextChange = ({target: {name, value}}) => {
    this.setState({ [name]: value });
  };

  render() {
    const { classes, open } = this.props;
    const { artistName } = this.state;

    console.log("Search - render", this.props);

    return (
      <Drawer
        className={classes.drawer}
        // variant="persistent"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <>
          <AppBar>
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Search for music
              </Typography>
              <IconButton onClick={this.onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Card className={classes.card}>
            <CardHeader title={artistName} />
            <CardContent>
              <TextField
                label="Artist"
                name="artistName"
                value={artistName}
                onChange={this.onTextChange}
              />
            </CardContent>
            <CardActions disableSpacing>
              <Fab
                aria-label="Search"
                color="primary"
                disabled={!artistName}
                onClick={this.onSearch}
              >
                <Icon>search</Icon>
              </Fab>
            </CardActions>
          </Card>
        </>
      </Drawer>
    );
  }
}

Search.propTypes = {
  open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	actions: PropTypes.object.isRequired
};

export default compose(
  withStateScoped("unassigned"),
  withStyles(styles)
)(Search);
