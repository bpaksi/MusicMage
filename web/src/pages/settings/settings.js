import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.saveChanges = this.saveChanges.bind(this)
  }

  saveChanges() {
    console.log('settings saved')

    const { history: { push } } = this.props;
    push('/')
  }

  render() {
    return (
      <div>
        <h1>Settings</h1>

        <button onClick={this.saveChanges}>Save Changes</button>

      </div>
    );
  }
}

export default withRouter(Settings);