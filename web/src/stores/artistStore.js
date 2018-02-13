import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import * as ArtistActions from '../actions/artist'

class ArtistStore extends EventEmitter {
  constructor() {
    super();

    this.isActive = false
    this.artists = []
  }

  getAll() {
    if (this.isActive === false) {
      this.isActive = true;

      ArtistActions.ArtistSubscribe()
    }

    return this.artists;
  }

  getByArtist(artist) {

    if (artist) {
      return this.getAll().filter((a) => {
        return a.artist === artist;
      })
  
    }

    return this.getAll()
  }

  handleActions(action) {
    // console.log("ArtistStore action called", action);

    switch (action.name) {
      case "artist all":
      case "artist add":
        this.artists.push(action.data)
        this.emit("change");

        break;
      case "artist delete":
        console.log("artist delete");
        break;

      case "artist change":
        console.log("artist change");
        break;

      default:
    }
  }
}

const artistStore = new ArtistStore();
dispatcher.register(artistStore.handleActions.bind(artistStore))

export default artistStore