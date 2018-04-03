package search

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
)

type trackParams struct {
	Artist     string `json:"artist"`
	Album      string `json:"album"`
	InternalID string `json:"internalId"`
}

func init() {

	connection.Router.Handle("SEARCH_TRACKS", ForTracks)
}

// ForTracks ...
func ForTracks(client *connection.Client, params trackParams) {
	// params := message.Payload.(map[string]interface{})
	// artist := safe("artist", params)
	// album := safe("album", params)
	// mbid := safe("mbid", params)

	results, err := client.Services.Search.SearchForTracks(params.Artist, params.Album, params.InternalID)
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
