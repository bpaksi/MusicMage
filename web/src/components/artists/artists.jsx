import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom'

import { withStyles } from 'material-ui/styles';

import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';

import * as actions from '../../state/actions'

const styles = theme => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    // width: 500,
    // height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

class Artists extends React.Component {
  componentDidMount() {
    this.props.actions.artistSubscribe();
  }
  componentWillUnmount() {
    this.props.actions.artistUnsubscribe();
  }

  onSelectArtist = (artist) => {
    const { history } = this.props;

    const url = "/artist/" + artist.name + "/" + artist.albumName
    history.push(url);
  }

  render() {
    const { classes, artists } = this.props;

    return (
      <div className={classes.root}>
        <GridList cellHeight="auto" className={classes.gridList} cols={4}>
          {artists.map(artist => (
            <GridListTile key={artist.id} onDoubleClick={() => this.onSelectArtist(artist)}>
              <img src="http://localhost:4000/images/default_artist.jpg" alt="blah" />
              <GridListTileBar
                title={artist.name}
                subtitle={artist.albumName}
                actionIcon={
                  <IconButton className={classes.icon} onClick={() => this.onSelectArtist(artist)}>
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    artists: state.artists,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Artists)));