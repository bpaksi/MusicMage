package unassigned

import (
	"path/filepath"
	"strings"

	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/services/database/songs"
)

// OnSubscribe ...
func OnSubscribe(client *connection.Client) (bool, string) {
	if client.Subscriptions.Contains(subscriptionName) {
		return false, ""
	}

	// initialize client
	for _, song := range client.Services.Database.Songs.Records {
		filterWrite(client, "UNASSIGNED_ADDED", song)
	}

	handlerKey := client.Services.Database.Songs.AddChangeHandler(func(old, new *songs.Song) {
		if old == nil {
			if new.File.Artist() == "" || new.File.Album() == "" {
				filterWrite(client, "UNASSIGNED_ADDED", new)
			}
		} else if new == nil || (new.File.Artist() != "" && new.File.Album() != "") {

			client.Send("UNASSIGNED_DELETED", old.ID)
		} else if old.File.Artist() == "" || old.File.Album() == "" {
			filterWrite(client, "UNASSIGNED_UPDATED", new)
		}
	})

	client.Subscriptions.Track(subscriptionName, func() {
		// log.Println("**Unassigned unsubscribe")

		client.Services.Database.Songs.RemoveChangeHandler(handlerKey)
	})

	return true, "success"
}

func filterWrite(client *connection.Client, command string, song *songs.Song) {
	base, filename := filepath.Split(song.File.FullPath)
	base = filepath.Dir(base)
	filename = strings.TrimSuffix(filename, filepath.Ext(filename))
	album := strings.TrimPrefix(base, filepath.Dir(base)+"/")
	parts := strings.Split(filename, " - ")

	artist := ""
	title := ""

	if len(parts) == 1 {
		title = parts[0]
	} else if len(parts) == 2 {
		artist = parts[0]
		title = parts[1]
	}

	rec := UnassignedRecord{
		ID:       song.ID,
		FullPath: song.File.FullPath,

		SuggestedArtist: artist,
		SuggestedAlbum:  album,
		SuggestedTitle:  title,

		Artist: song.File.Artist(),
		Album:  song.File.Album(),
		Title:  song.File.Title(),
	}

	client.Send(command, rec)
}
