import React from "react";
import PropTypes from "prop-types";
// import Undo from "material-ui/svg-icons/content/undo";
import Undo from "@material-ui/icons/Undo";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";

class EditField extends React.Component {
  onChange = e => {
    const { data, onChange } = this.props;
		console.log('EditField - onChange: ', data);

    onChange(e, e.target.value, data);
  };

  onUndo = e => {
    const { data, onUndo } = this.props;

    onUndo(e, data);
  };

  render() {
    const { value, isDirty, data, onUndo, onChange, ...otherProps } = this.props;

    return (
      <div>
        <TextField
          value={value}
          onChange={this.onChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div style={{ width: "45px", minHeight: "1px" }}>
                  {isDirty && (
                    <Tooltip title="Undo">
                      <IconButton disabled={!isDirty} onClick={onUndo}>
                        <Undo fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </InputAdornment>
            )
          }}
          {...otherProps}
        />
      </div>
    );
  }
}

EditField.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  onUndo: PropTypes.func
};

EditField.defaultProps = {};

export default EditField;
