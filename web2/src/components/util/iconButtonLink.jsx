import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import IconButton from "@material-ui/core/IconButton";

class IconButtonLink extends React.Component {
  onClick = () => {
    const {history, url, onClick,} = this.props;
    history.push(url);

    if (onClick) {
      onClick();
    }
  }

  render() {
    const {match, location, history, url, onClick, staticContext, ...props} = this.props;

    return (
      <IconButton {...props} onClick={this.onClick}>
        {this.props.children}
      </IconButton>
    );
  }
}

IconButtonLink.propTypes = {
  url: PropTypes.string.isRequired,
};

export default withRouter(IconButtonLink);