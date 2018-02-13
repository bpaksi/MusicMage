import React, { Component } from 'react';
import ArtistStore from '../../stores/artistStore'
// import * as ArtistActions from '../../actions/artist'
import ArtistRow from './artistRow'

class Artist extends Component {

  componentWillReceiveProps(nextProps) {
    const {params} = nextProps.match

    this.state = {
      artists: ArtistStore.getByArtist(params.artist)
    }}

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  componentWillMount() {
    ArtistStore.on("change", this.onChange);


    console.log("artist: add handler")    
  }

  componentWillUnmount() {
    ArtistStore.removeListener("change", this.onChange);
  
 
    console.log("artist: remove handler")
   }

  onChange = () => {
 
    const {params} = this.props.match
    
   console.log("artis: change handler: " +  params.artist)

    this.setState({
      artists: ArtistStore.getByArtist(params.artist)
    })
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


