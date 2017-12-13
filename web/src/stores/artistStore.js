import { EventEmitter } from "events";
import dispatcher from "../dispatcher";


class ArtistStore extends EventEmitter {
  constructor() {
    super();

    this.artists = []
  }

  refresh() {
    this.emit("change");
  }

  getAll() {
    return this.artists;
  }

  getByArtist(artist) {
    return this.artists.filter( (a) => {
      return a.artist === artist;
    } )
  }

  handleActions(action) {
    // console.log("ArtistStore action called", action);

    switch (action.name) {
      case "artist all":    
      case "artist add":
        console.log("artist add");

        this.artists.push(action.data)
        this.emit("change");

        break;
      case "artist delete":
        console.log("artist delete");
        break;

      case "artist change":
        console.log("artist change");
        break;

        case "artist unsubscribe":
        console.log("artists unsubscribe");

        this.artists = []
        this.emit("change");
        
        break;
        default:
    }
  }
}

const artistStore = new ArtistStore();
dispatcher.register(artistStore.handleActions.bind(artistStore))

export default artistStore