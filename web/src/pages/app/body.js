import React from "react";
import { withState } from "../withState";
// import Slide from "@material-ui/core/Slide";

import { routes } from "../routes";

class Body extends React.Component {
  render() {
    const { navigation } = this.props;
    if (navigation.stack.length === 0) {
      return null;
    }

    const step = navigation.stack[navigation.stack.length - 1];
		const route = routes[step.key];

		if (!route.render) return null;

    return route.render(step.param);

		// return (
    //   <Slide key={activeStep.key} direction={navigation.direction === "forward" ? "left" : "right"} in={true}>
    //     {render()}
    //   </Slide>
    // );
  }
}

export default withState()(Body);
