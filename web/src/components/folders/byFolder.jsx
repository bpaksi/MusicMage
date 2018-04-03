import React from "react";
import Grid from "material-ui/Grid";
import Folders from "./folders";
import Search from "./search";
import Files from "./files";
import * as actions from "../../state/actions";

import Button from 'material-ui/Button';

class byFolder extends React.Component {
  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <Grid container spacing={8}>
          <Grid item xs={2}>
            <Folders />
          </Grid>
          <Grid item xs={10}>
            <Files />{" "}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default byFolder;
