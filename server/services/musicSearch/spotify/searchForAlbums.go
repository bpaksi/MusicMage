package spotify

import (
	"fmt"

	"github.com/bpaksi/MusicMage/server/services/musicSearch/data"
	"github.com/zmb3/spotify"
)

// SearchForAlbums ...
func (api *API) SearchForAlbums(artist string) (results []data.AlbumRecord, err error) {

	r, e := api.client.Search(artist, spotify.SearchTypePlaylist|spotify.SearchTypeAlbum)
	if e != nil {
		err = e
		return
	}

	// handle album results
	if r.Albums != nil {
		// log.Printf("Spotify - artist search: %s, Album Cnt: %d", artist, len(r.Albums.Albums))

		for _, item := range r.Albums.Albums {
			fmt.Println("   ", item.Name)

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
