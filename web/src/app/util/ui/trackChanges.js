import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Undo from "@material-ui/icons/Undo";

class TrackChanges extends React.Component {
  onUndo = () => {
    const { onUndo, data } = this.props;

    onUndo(data);
  };

  render() {
    const { dirty, children } = this.props;
    const styles = {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      },
      wrapper: { width: "100%" },
      undo: {
        width: "20px"
      },

      undoButton: {
        padding: "0"
      }
    };

    return (
      <div style={styles.container}>
        {<div style={styles.wrapper}>{children}</div>}
        <div style={styles.undo}>
          {dirty && (
            <Tooltip title="Undo">
              <IconButton style={styles.undoButton} onClick={this.onUndo}>
                <Undo fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}

TrackChanges.propTypes = {
  dirty: PropTypes.bool.isRequired,
  onUndo: PropTypes.func.isRequired,
  data: PropTypes.object
};

export function withTrackChanges() {
  return Wrapped => props => {
    const { dirty, onUndo, ...rest } = props;

    return (
      <TrackChanges dirty={dirty} onUndo={onUndo} data={props.data}>
        <Wrapped {...rest} />
      </TrackChanges>
    );
  };
}
