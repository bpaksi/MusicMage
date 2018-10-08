import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // width: 200,
  },
});

class GridField extends React.Component {
  state = {
    value: this.props.context[this.props.contextAttrib],
  };

  catchReturn = (e) => {
    if (e.key === 'Enter') {
      this.onBlur();
    }
  }

  onChange = (evt, b) => {
    this.setState({ value: evt.target.value });

    const { onChange } = this.props;
    if (onChange) {
      onChange(evt, {newValue: evt.target.value})
    }
    
  }

  onBlur = () => {
    const { contextAttrib, context, onTextChanged } = this.props;
    const defaultValue = context[contextAttrib];

    if (onTextChanged) {
      if (defaultValue !== this.state.value) {
        onTextChanged(contextAttrib, context, this.state.value);
      }
    }
  }

  render() {
    const { contextAttrib, context, type, classes } = this.props;
    const defaultValue = context[contextAttrib];

    return (
      <TextField
        defaultValue={defaultValue}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onKeyPress={this.catchReturn}
        type={type}
        className={classes.textField}
      />
    )
  }
}

GridField.propTypes = {
  contextAttrib: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired,
  type: PropTypes.string,
  onTextChanged: PropTypes.func,
};

GridField.defaultProps = {
  type: "text",
};

export default withStyles(styles)(GridField);