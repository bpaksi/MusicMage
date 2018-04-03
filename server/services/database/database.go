package database

import (
	"log"

	"github.com/bpaksi/MusicMage/server/services/database/artists"
	"github.com/bpaksi/MusicMage/server/services/database/files"
	"github.com/bpaksi/MusicMage/server/services/database/songs"
	"github.com/bpaksi/MusicMage/server/services/database/watcher"
)

// Database ...
type Database struct {
	RootFolder string
	files      *files.Files
	Artists    *artists.Artists
	Songs      *songs.Songs
	watcher    *watcher.Watcher
}

// NewDatabase ...
func NewDatabase(rootFolder string) *Database {
	database := &Database{}
	database.RootFolder = rootFolder

	database.watcher = watcher.NewWatcher()

	database.files = files.NewFileDatabase(database.watcher)
	database.Artists = artists.NewArtistIndex(database.files)
	database.Songs = songs.NewSongIndex(database.files)

	database.watcher.Start(rootFolder)

	log.Println("\tDatabase opened: ", rootFolder)
	return database
}
