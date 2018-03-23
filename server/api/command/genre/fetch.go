package genre

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
)

// Fetch ...
func Fetch(client *connection.ClientConnection, message connection.Message) {
	genres := make([]string, 0)

	for _, song := range client.Database.Songs.Records {
		genre := song.File.Genre()
		if genre == "" {
			continue
		}

		if !contains(genres, genre) {
			genres = append(genres, genre)

			client.Write(connection.Message{
				Type:    "GENRE",
				Payload: genre,
			})
		}
	}
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
