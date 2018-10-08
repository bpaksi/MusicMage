import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";

import Banner from "./banner";
import Routes from "./routes";
import Notify from "./util/notify";
import Confiirm from "./util/confirm";
import * as actions from "../state/actions";

import "../App.css";

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: "10px"
  }
});

class App extends React.Component {
  componentDidMount() {
    this.props.actions.websocketConnect("ws://localhost:4000/api");
  }
  componentWillUnmount() {
    this.props.actions.websocketDisconnect();
  }

  render() {
   const { confirm,  notify, classes, dispatch } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
           <Grid container spacing={8}>
             <Grid item xs={12}>
               <Banner />
               <Paper >
                 <Routes />
               </Paper>
               <Confiirm confirm={confirm} dispatch={dispatch}/>
               <Notify notify={notify} dispatch={dispatch}/>
             </Grid>
           </Grid>
         </div>
      </React.Fragment>
    );
    // return (
    //   <React.Fragment>
    //     <CssBaseline />
    //     <div className={classes.root}>
    //       <Grid container spacing={8}>
    //         <Grid item xs={12}>
    //           <Banner />
    //           <Paper >
    //             <Routes />
    //           </Paper>
    //           <Confiirm confirm={confirm} dispatch={dispatch}/>
    //           <Notify notify={notify} dispatch={dispatch}/>
    //         </Grid>
    //       </Grid>
    //     </div>
    //   </React.Fragment>
    // );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    confirm: state.confirm,
    notify: state.notify
  };
};

const mapDispatchToProps = dispatch => {
  return { dispatch, actions: bindActionCreators(actions, dispatch) };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(App))
);
