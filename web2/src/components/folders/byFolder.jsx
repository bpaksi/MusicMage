import React from "react";
import Grid from "@material-ui/core/Grid";
import Folders from "./folders";
import Files from "./files";

const byFolder = () => (
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

export default byFolder;
