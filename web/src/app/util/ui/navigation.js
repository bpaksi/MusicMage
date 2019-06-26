import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Icon from "@material-ui/core/Icon";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";

import { withRouter } from "react-router";

const styles = {
  connector: {
    marginLeft: "5px",
    marginRight: "5px"
  }
};

const BreadcrumpConnector = ({ classes }) => (
  <span className={classes.connector}>/</span>
);

class NavStep extends React.Component {
  onClick = () => {
    const { to, history } = this.props;

    console.log("NavStep2.onClick", { to, history });

    history.push(to);
  };

  render() {
    const { label, icon, active } = this.props;

    return (
      <Step>
        <StepButton
          icon={
            icon && <Icon color={active ? "primary" : "action"}>{icon}</Icon>
          }
          onClick={!active ? this.onClick : undefined}
        >
          {label}
        </StepButton>
      </Step>
    );
  }
}

NavStep.propTypes = {
  steps: PropTypes.array
};

const NavigationStep = withRouter(NavStep);

class Nav extends React.Component {
  render() {
    const { steps, classes } = this.props;

    const activeStep = steps.length - 1;

    return (
      <Stepper
        activeStep={activeStep}
        connector={<BreadcrumpConnector classes={classes} />}
      >
        {steps.map((step, idx) => (
          <NavigationStep
            key={step.name}
            label={step.name}
            to={step.route}
            icon={step.icon}
            active={idx === activeStep}
            // onClick={() => actions.navigateBack(idx)}
          />
        ))}
      </Stepper>
    );
  }
}

Nav.propTypes = {
  steps: PropTypes.array.isRequired
};

const Navigation = withStyles(styles)(Nav);

const LibraryStep = { route: "/", name: "Library", icon: "library_music" };
const ArtistsStep = { route: "/artists", name: "Artists", icon: "people" };
const SettingsStep = { route: "/settings", name: "Settings", icon: "settings" };
const AlbumStep = (artist, album) => ({
  route: "/album/" + artist + "/" + album,
  name: artist,
  icon: "album"
});

export default Navigation;
export { Navigation, LibraryStep, ArtistsStep, AlbumStep, SettingsStep };
