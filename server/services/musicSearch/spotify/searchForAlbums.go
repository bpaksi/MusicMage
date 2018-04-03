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

		for _, item := range r.Albums.Albums {
			fmt.Println("   ", item.Name)

			results = append(results, data.AlbumRecord{
				Artist: artist,
				Name:   item.Name,
				// URL:    item.URI,
				// Mbid:   item.ID,
			})
		}
	}

	return
}
