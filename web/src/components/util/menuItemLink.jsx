import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { MenuItem } from 'material-ui/Menu';
import { ListItemIcon, ListItemText } from 'material-ui/List';

class MenuItemLink extends React.Component {
  renderLink = itemProps => <Link to={this.props.to} {...itemProps} />;

  render() {
    const { icon, primary, secondary} = this.props;
    return (
        <MenuItem component={this.renderLink}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText inset primary={primary} secondary={secondary} />
        </MenuItem>
    );
  }
}

MenuItemLink.propTypes = {
  icon: PropTypes.object,
  to: PropTypes.string.isRequired,
  primary: PropTypes.string,
  secondary: PropTypes.string,
};

export default MenuItemLink;
