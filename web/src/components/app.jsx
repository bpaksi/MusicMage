import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import CssBaseline from 'material-ui/CssBaseline';

import Banner from './banner'
import Routes from './routes'
import Notify from './util/notify'
import Confiirm from './util/confirm'
import * as actions from '../state/actions'

import '../App.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: "10px",
  },
});

class App extends React.Component {
  componentWillMount() {
    this.props.actions.websocketConnect("ws://localhost:4000/api");
  }
  componentWillUnmount() {
    this.props.actions.websocketDisconnect();
  }

  render() {
    const { confirm, notify, classes } = this.props;

    return (
      <div>
        <CssBaseline />
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs>
              <Banner />
              <Paper >
                <Routes />
              </Paper>
              <Confiirm confirm={confirm}/>
              <Notify notify={notify}/>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    confirm: state.confirm,
    notify: state.notify,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App)));
