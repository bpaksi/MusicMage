import React from 'react';
import { Route } from 'react-router-dom'
import { withStyles } from 'material-ui/styles';

import Home from './home/home'
import Artists from './artists/artists'
import Artist from './artists/artist'
import Folders from './folders/folders'

const styles = theme => ({
  route: {
    margin: "10px",
    minHeight: "500px",  
  }
});

const Routes = (props) => {
  const {classes} = props;

  return (
    <div className={classes.route}> 
      <Route exact path="/" component={Home} />
      <Route path="/artist/:artist/:album" component={Artist} />
      <Route path="/artists" component={Artists} />
      <Route path="/folders" component={Folders} />
    </div>
  );
}

export default withStyles(styles)(Routes);