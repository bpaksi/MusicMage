import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withStateScoped, compose } from "./withState";

// import Slide from "@material-ui/core/Slide";
import Paper from "@material-ui/core/Paper";

import { routes } from "./routes";

const styles = theme => ({
  paper: {
    margin: "5px"
  }
});

class Client extends React.Component {
  render() {
    const { navigation, classes } = this.props;
    if (navigation.stack.length === 0) {
      return null;
    }

    const step = navigation.stack[navigation.stack.length - 1];
    const route = routes[step.key];

		if (!route.render) return null;
		
		const params = {...step.param, key: step.key + navigation.pageKey }
    return <Paper className={classes.paper}>{route.render(params)}</Paper>;

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
