package album

import (
	"log"

	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/services/database/songs"
)

type params struct {
	Artist string `json:"artist"`
	Album  string `json:"album"`
}

// OnSubscribe ...
func OnSubscribe(client *connection.Client, params params) {
	if client.Subscriptions.Contains(subscriptionName) {
		return
	}

	log.Printf("parameters: %s, %s", params.Artist, params.Album)

	// initialize client
	for _, song := range client.Services.Database.Songs.Records {
		filterWrite(client, "SONG_ADDED", song, params.Artist, params.Album)
	}

	handlerKey := client.Services.Database.Songs.AddChangeHandler(func(old, new *songs.Song) {
		if old.ID == 0 {
			filterWrite(client, "SONG_ADDED", new, params.Artist, params.Album)
		} else if new.ID == 0 {
			filterWrite(client, "SONG_DELETED", old, params.Artist, params.Album)
		} else {
			filterWrite(client, "SONG_UPDATED", new, params.Artist, params.Album)
		}
	})

	client.Subscriptions.Track(subscriptionName, func() {
		log.Println("**Album unsubscribe")

		client.Services.Database.Songs.RemoveChangeHandler(handlerKey)
	})
}

func filterWrite(client *connection.Client, command string, song *songs.Song, artist, album string) {
	if artist == song.File.Artist() && album == song.File.Album() {
		rec := SongRecord{
			ID:     song.ID,
			Artist: song.File.Artist(),
			Album:  song.File.Album(),
			Title:  song.File.Title(),
			Genre:  song.File.Genre(),
			Year:   song.File.Year(),
		}

		client.Send(command, rec)
	}
}
