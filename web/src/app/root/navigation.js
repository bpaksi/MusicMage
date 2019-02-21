import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withState, compose } from "../util";

import Icon from "@material-ui/core/Icon";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import { routes } from "../routes";

const styles = {
  connector: {
    marginLeft: "5px",
    marginRight: "5px"
  }
};

const BreadcrumpConnector = ({ classes }) => (
  <span className={classes.connector}>/</span>
);

const NavStep = ({ route, active, onClick }) => (
  <Step>
    <StepButton
      icon={
        route.icon && (
          <Icon color={active ? "primary" : "action"}>{route.icon}</Icon>
        )
      }
      onClick={onClick}
    >
      {route.label}
    </StepButton>
  </Step>
);

class Navigation extends React.Component {
  render() {
    const { navigation, classes, actions } = this.props;
    const activeStep = navigation.stack.length - 1;

    return (
      <Stepper
        activeStep={activeStep}
        connector={<BreadcrumpConnector classes={classes} />}
      >
        {navigation.stack.map((node, idx) => (
          <NavStep
            key={node.key}
            route={routes[node.key]}
            active={idx === activeStep}
            onClick={() => actions.navigateBack(idx)}
          />
        ))}
      </Stepper>
    );
  }
}

export default compose(
  withState(),
  withStyles(styles)
)(Navigation);