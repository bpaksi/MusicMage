package spotify

import (
	"log"

	"github.com/bpaksi/MusicMage/server/services/musicSearch/data"
	"github.com/zmb3/spotify"
)

// SearchForAlbums ...
func (api *API) SearchForAlbums(artist string) (results []data.AlbumRecord, err error) {

	log.Printf("Spotify - SearchForAlbums: %s", artist)

	var r *spotify.SearchResult
	r, err = api.client.Search(artist, spotify.SearchTypeArtist|spotify.SearchTypeAlbum)
	if err != nil {
		log.Printf("Spotify - SearchForAlbums: error=%s", err.Error())

		return
	}

	log.Printf("Spotify - SearchForAlbums: results=%+v", r)

	// handle album results
	if r.Albums != nil {
		// log.Printf("Spotify - artist search: %s, Album Cnt: %d", artist, len(r.Albums.Albums))

		for _, item := range r.Albums.Albums {
			log.Println("   " + item.Name)

			artist := ""
			artistInternalID := ""
			artistURL := ""
			if len(item.Artists) > 0 {
				artist = item.Artists[0].Name
				artistInternalID = string(item.Artists[0].ID)
				artistURL = string(item.Artists[0].URI)
			}

			albumImageURL := ""
			if len(item.Images) > 0 {
				albumImageURL = item.Images[0].URL
			}

			results = append(results, data.AlbumRecord{
				Artist:           artist,
				ArtistInternalID: artistInternalID,
				ArtistURL:        artistURL,
				Album:            item.Name,
				AlbumInternalID:  string(item.ID),
				AlbumURL:         string(item.URI),
				AlbumImageURL:    albumImageURL,
				Source:           "Spotify",
			})
		}
	}

	return
}

func parseURI(uri string) (url string) {
	// spotify:album:0oYFgjXHENrlHEsHIf7b45 -> http://open.spotify.com/album:0oYFgjXHENrlHEsHIf7b45
	//

	return

}
