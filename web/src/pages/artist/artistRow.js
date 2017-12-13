import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

class Artist extends Component {
  render() {
    const {artist} = this.props

    return (
      <tr>
        <td><NavLink to={"artist/" + artist.artist}>{artist.artist}</NavLink></td>
        <td><NavLink to={"artist/" + artist.artist + "/" + artist.album}>{artist.album}</NavLink></td>
        <td>{artist.songCount}</td>
      </tr>
    );
  }
}

export default Artist; 