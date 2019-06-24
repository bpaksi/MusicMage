import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose } from "../util";

// import Slide from "@material-ui/core/Slide";
import Paper from "@material-ui/core/Paper";

import { routes } from "../routes";

const styles = theme => ({
  paper: {
    margin: "5px"
  }
});

class Client extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        {Object.keys(routes).filter(k => routes[k].router).map(k => routes[k].router())}
      </Paper>
    );

    // return (
    //   <Slide key={activeStep.key} direction={navigation.direction === "forward" ? "left" : "right"} in={true}>
    //     {render()}
    //   </Slide>
    // );
  }
}

export default compose(
  withStateScoped("navigation"),
  withStyles(styles)
)(Client);
