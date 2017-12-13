import React, { Component } from 'react';
import ArtistStore from '../../stores/artistStore'
// import * as ArtistActions from '../../actions/artist'
import ArtistRow from './artistRow'

class Artist extends Component {
  constructor(props) {
    super(props);

    const {params} = this.props.match
    this.artist = params.artist

    this.state = {
      artists: ArtistStore.getByArtist(this.artist)
    }
  }

  componentWillMount() {
     ArtistStore.on("change", () => {
      this.setState({
        artists: ArtistStore.getByArtist(this.artist)
      })
    });
  }

  render() {
    const { artists } = this.state;

    return (
      <div>
        <h1 >{this.artist}</h1>
        <table className="table table-striped table-bordered table-hover table-condensed">
          <thead>
            <tr>
              <th>Artist</th>
              <th>Album</th>
              <th>Song Count</th>
            </tr>
          </thead>
          <tbody>
            {artists.map(function (artist) {
              return <ArtistRow key={artist.id} artist={artist} />;
            })}            
          </tbody>
        </table>

      </div>
    );
  }
}


export default Artist;


