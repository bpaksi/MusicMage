import React from "react";
import { withState } from "../withState";
// import Slide from "@material-ui/core/Slide";

import Library from "../library";
import Artists from "../artists";

const renderMethods = {
  library: () => <Library />,
  artists:() => <Artists />
};

class Body extends React.Component {
  render() {
    const { navigation } = this.props;
    if (navigation.stack.length === 0) {
      return null;
    }

    const activeStep = navigation.stack[navigation.stack.length - 1];
    const render = renderMethods[activeStep.key];
    if (!render) {
      return null;
    }

		return render()
    // return (
    //   <Slide key={activeStep.key} direction={navigation.direction === "forward" ? "left" : "right"} in={true}>
    //     {render()}
    //   </Slide>
    // );
  }
}

export default withState()(Body);
