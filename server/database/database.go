package database

import (
	"log"

	"github.com/bpaksi/MusicMage/server/database/songs"

	"github.com/bpaksi/MusicMage/server/database/files"

	"github.com/bpaksi/MusicMage/server/database/artists"
	"github.com/bpaksi/MusicMage/server/database/watcher"
)

// Database ...
type Database struct {
	files   *files.Files
	Artists *artists.Artists
	Songs   *songs.Songs
	watcher *watcher.Watcher
}

// NewDatabase ...
func NewDatabase(rootFolder string) *Database {
	database := &Database{}

	database.watcher = watcher.NewWatcher()

	database.files = files.NewFileDatabase(database.watcher)
	database.Artists = artists.NewArtistIndex(database.files)
	database.Songs = songs.NewSongIndex(database.files)

	database.watcher.Start(rootFolder)

	log.Println("\tDatabase opened: ", rootFolder)
	return database
}
