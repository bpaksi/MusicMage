package song

import (
	"fmt"
	"os"

	"github.com/bpaksi/MusicMage/server/api/connection"
)

// OnDelete ...
func OnDelete(client *connection.ClientConnection, message connection.Message) {
	defer func() {
		if r := recover(); r != nil {
			client.Write(connection.Message{
				Type:    "SONG_UPDATE_ERR",
				Payload: r,
			})
		}
	}()

	id := int64(message.Payload.(float64))

	for _, song := range client.Database.Songs.Records {
		if song.ID == id {
			err := os.Remove(song.File.FullPath)

			if err != nil {
				client.Write(connection.Message{
					Type:    "SONG_UPDATE_ERR",
					Payload: err.Error(),
				})
			}

			return
		}
	}

	client.Write(connection.Message{
		Type:    "SONG_UPDATE_ERR",
		Payload: fmt.Sprintf("No song found with id = %d", id),
	})

}
