package search

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
)

// ForTracks ...
func ForTracks(client *connection.Client, message connection.Message) {
	params := message.Payload.(map[string]interface{})
	artist := safe("artist", params)
	album := safe("album", params)
	mbid := safe("mbid", params)

	results, err := client.Services.Search.SearchForTracks(artist, album, mbid)
	if err != nil {
		client.Error(err.Error())
	}

	client.Send("SEARCH_TRACK_RESULTS", results)
}

func safe(attribute string, attributes map[string]interface{}) (result string) {
	val, ok := attributes[attribute]
	result = ""
	if ok {
		result = val.(string)
	}

	return
}
