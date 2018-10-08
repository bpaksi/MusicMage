import React from "react";
import { withState } from "../withState";
import Icon from "@material-ui/core/Icon";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";

import Library from "../library";
import Artists from "../artists";

const routes = {
  library: {
    label: "Library",
    icon: "library_music",
    render: () => <Library />
  },
  artists: {
    label: "Artists",
    icon: "person"
  },
  albums: {
    label: "Albums",
    icon: "album",
    render: () => <Artists />
  }
};

const BreadcrumpConnector = () => <span>/</span>;

class Navigation extends React.Component {
  onNavigate = idx => {
    const { navigation, actions } = this.props;
    if (idx < navigation.stack.length - 1) {
      actions.navigateBack(idx);
    }
  };

  render() {
    const { navigation } = this.props;
    const activeStep = navigation.stack.length - 1;

    return (
      <Stepper activeStep={activeStep} connector={<BreadcrumpConnector />}>
        {navigation.stack.map((node, idx) => (
          <Step key={node.key}>
            <StepButton
              icon={
                routes[node.key].icon && (
                  <Icon color={activeStep === idx ? "primary" : "action"}>
                    {routes[node.key].icon}
                  </Icon>
                )
              }
              onClick={() => this.onNavigate(idx)}
            >
              {routes[node.key].label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    );
  }
}

export default withState()(Navigation);
