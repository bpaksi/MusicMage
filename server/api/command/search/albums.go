package search

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
)

type albumParams struct {
	Artist string `json:"artist"`
}

func init() {
	connection.Router.Handle("SEARCH_ALBUM", ForAlbums)
}

// ForAlbums ...
func ForAlbums(client *connection.Client, params albumParams) {
	results, err := client.Services.Search.SearchForAlbums(params.Artist)
	if err != nil {
		client.Error(err.Error())
		return
	}

	client.Send("SEARCH_ALBUM_RESULTS", results)
}
