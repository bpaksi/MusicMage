package genre

import "github.com/bpaksi/MusicMage/server/api/connection"

func init() {
	connection.Router.Handle("GENRES_FETCH", All)
}

// All ...
func All(client *connection.Client) {
	genres := make([]string, 0)

	for _, song := range client.Services.Database.Songs.Records {
		genre := song.File.Genre()
		if genre != "" {
			if !contains(genres, genre) {
				genres = append(genres, genre)
			}
		}
	}

	client.Send("GENRES_FETCHED", genres)
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
