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
	// params := message.Payload.(map[string]interface{})
	// artist := params["artist"].(string)

	// log.Println("here")

	results, err := client.Services.Search.SearchForAlbums(params.Artist)
	if err != nil {
		client.Error(err.Error())
	}

	client.Send("SEARCH_ALBUM_RESULTS", results)
}
