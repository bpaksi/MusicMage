import React from "react";
import { withStyles } from "@material-ui/core/styles";

// import Icon from "@material-ui/core/Icon";
// import Step from "@material-ui/core/Step";
// import StepButton from "@material-ui/core/StepButton";
// import Stepper from "@material-ui/core/Stepper";
// import { routes } from "../routes";
// import { Link } from "react-router-dom";

const styles = {
  connector: {
    marginLeft: "5px",
    marginRight: "5px"
  }
};

// const BreadcrumpConnector = ({ classes }) => (
//   <span className={classes.connector}>/</span>
// );

// const NavStep = ({ route, active, onClick }) => (
//   <Step>
//     <StepButton
//       component={Link}
//       icon={
//         route.icon && (
//           <Icon color={active ? "primary" : "action"}>{route.icon}</Icon>
//         )
//       }
//       to={route.path}
//       // onClick={onClick}
//     >
//       {route.label}
//     </StepButton>
//   </Step>
// );

class Navigation extends React.Component {
  render() {
    // const { classes } = this.props;

return null

    // return (
    //   <Stepper
    //     // activeStep={activeStep}
    //     connector={<BreadcrumpConnector classes={classes} />}
    //   >
    //     {/* {navigation.stack.map((node, idx) => (
    //       <NavStep
    //         key={node.key}
    //         route={routes[node.key]}
    //         active={idx === activeStep}
    //         // onClick={() => actions.navigateBack(idx)}
    //       />
    //     ))} */}
    //   </Stepper>
    // );
  }
}

export default withStyles(styles)(Navigation);
