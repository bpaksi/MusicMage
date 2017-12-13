import React, { Component } from 'react';
import ArtistStore from '../../stores/artistStore'
import * as ArtistActions from '../../actions/artist'
import ArtistRow from './artistRow'

class ArtistAll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artists: ArtistStore.getAll()
    }
  }

  componentWillMount() {
    ArtistActions.ArtistSubscribe()

    ArtistStore.on("change", () => {
      console.log("page artist: change handler")

      this.setState({
        artists: ArtistStore.getAll()
      })
    });
  }

  componentWillUnmount() {
    ArtistActions.ArtistUnsubscribe()
  }

  render() {
    const { artists } = this.state;

    return (
      <div>
        <h1 >Artists</h1>
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
              return <ArtistRow artist={artist} />;
            })}            
          </tbody>
        </table>

      </div>
    );
  }
}


export default ArtistAll;


