package song

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
)

// OnUpdate ...
func OnUpdate(client *connection.ClientConnection, message connection.Message) {
	// log.Printf("song update message: %#v", message)

	params := message.Payload.(map[string]interface{})
	id := int64(params["id"].(float64))
	artist := params["artist"].(string)
	album := params["album"].(string)
	title := params["title"].(string)
	genre := params["genre"].(string)
	year := params["year"].(string)

	for _, song := range client.Database.Songs.Records {
		if song.ID == id {
			_, err := song.File.SetAttributes(
				artist,
				album,
				title,
				genre,
				year)

			if err != nil {
				client.Write(connection.Message{
					Type:    "SONG_UPDATE_ERR",
					Payload: err.Error(),
				})
			}
		}
	}

}
