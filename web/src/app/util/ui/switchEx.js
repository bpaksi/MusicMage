import React from "react";
import Switch from "@material-ui/core/Switch";
import { withCustomData } from "./withCustomData";

class SwitchEx2 extends React.Component {
  onChange = (e, checked) => {
    const { onChange, equivalent, data } = this.props;

    onChange(e, checked ? equivalent.t : equivalent.f, data);
  };

  render() {
    const { checked, equivalent, data, ...props } = this.props;
    props.onChange = this.onChange;
    props.checked = checked === equivalent.t;

    return <Switch {...props} />;
  }
}

SwitchEx2.defaultProps = {
  equivalent: { t: true, f: false }
};

SwitchEx2.propTypes = {
  equivalent: React.PropTypes.object,
  onChange: React.PropTypes.func
};

const SwitchEx = withCustomData(e => e.target.value)(Switch);
export { SwitchEx, SwitchEx2 };
