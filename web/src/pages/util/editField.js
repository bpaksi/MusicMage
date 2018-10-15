import React from "react";
import PropTypes from "prop-types";
// import Undo from "material-ui/svg-icons/content/undo";
import Undo from "@material-ui/icons/Undo";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";

const styles = {
  textField: {},
  button: {
    width: 25,
    height: 48,
    padding: 0
  },
  icon: {
    width: 20,
    height: 20
  }
};

class EditField extends React.Component {
  render() {
    const { value, isDirty, type, onChange, onUndo } = this.props;

    return (
      <div>
        <TextField
          // className={classes.textField}
					value={value}
					type={type}
          onChange={onChange}
          margin="normal"
          InputProps={{
            endAdornment: isDirty && (
              <InputAdornment position="end">
                <Tooltip title="Undo">
                  <IconButton
										disabled={!isDirty}
                    onClick={onUndo}
                  >
                    <Undo fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )
          }}
        />
      </div>
    );
  }
}

EditField.propTypes = {
	value: PropTypes.any.isRequired,
	type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  onUndo: PropTypes.func
};

// AddAddressComponent.defaultProps = {
//   type: "text"
// };

export default EditField;
