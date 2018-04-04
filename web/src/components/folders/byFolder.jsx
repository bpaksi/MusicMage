import React from "react";
import Grid from "material-ui/Grid";
import Folders from "./folders";
import Files from "./files";

class byFolder extends React.Component {
  render() {
    return (
      <div style={{ flexGrow: 1 }}>
        <Grid container spacing={8}>
          <Grid item xs={3}>
            <Folders />
          </Grid>
          <Grid item xs={8}>
            <Files />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default byFolder;
