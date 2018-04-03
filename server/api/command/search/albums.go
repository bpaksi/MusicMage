package search

import (
	"log"

	"github.com/bpaksi/MusicMage/server/api/connection"
)

// ForAlbums ...
func ForAlbums(client *connection.Client, message connection.Message) {
	params := message.Payload.(map[string]interface{})
	artist := params["artist"].(string)

	log.Println("here")

	results, err := client.Services.Search.SearchForAlbums(artist)
	if err != nil {
		client.Error(err.Error())
	}

	client.Send("SEARCH_ALBUM_RESULTS", results)
}
