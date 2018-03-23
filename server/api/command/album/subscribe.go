package album

import (
	"log"

	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/database/songs"
)

// OnSubscribe ...
func OnSubscribe(client *connection.ClientConnection, message connection.Message) {
	if client.ContainsSubscription(subscriptionName) {
		return
	}

	params := message.Payload.(map[string]interface{})
	artist := params["artist"].(string)
	album := params["album"].(string)

	// log.Printf("parameters: %s, %s", artist, album)

	// initialize client
	for _, song := range client.Database.Songs.Records {
		filterWrite(client, "SONG_ADDED", song, artist, album)
	}

	handlerKey := client.Database.Songs.AddChangeHandler(func(old, new *songs.Song) {
		if old.ID == 0 {
			filterWrite(client, "SONG_ADDED", new, artist, album)
		} else if new.ID == 0 {
			filterWrite(client, "SONG_DELETED", old, artist, album)
		} else {
			filterWrite(client, "SONG_UPDATED", new, artist, album)
		}
	})

	client.TrackSubscription(subscriptionName, func() {
		log.Println("**Album unsubscribe")

		client.Database.Songs.RemoveChangeHandler(handlerKey)
	})
}

func filterWrite(client *connection.ClientConnection, command string, song *songs.Song, artist, album string) {
	if artist == song.File.Artist() && album == song.File.Album() {
		rec := SongRecord{
			ID:     song.ID,
			Artist: song.File.Artist(),
			Album:  song.File.Album(),
			Title:  song.File.Title(),
			Genre:  song.File.Genre(),
			Year:   song.File.Year(),
		}

		client.Write(connection.Message{
			Type:    command,
			Payload: rec,
		})
	}
}
