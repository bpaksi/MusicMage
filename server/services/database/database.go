package database

import (
	"log"

	"github.com/bpaksi/MusicMage/server/tools/messagebus"

	// allow database services to register themselves
	_ "github.com/bpaksi/MusicMage/server/services/database/artists"
	_ "github.com/bpaksi/MusicMage/server/services/database/songs"
	_ "github.com/bpaksi/MusicMage/server/services/database/watcher"
)

// Database ...
type Database struct {
	RootFolder string
}

// NewDatabase ...
func NewDatabase(rootFolder string) *Database {
	database := &Database{}
	database.RootFolder = rootFolder

	messagebus.Publish("DATABASE_STARTUP", rootFolder)

	log.Println("\tDatabase opened: ", rootFolder)
	return database
}

// Shutdown ...
func (db *Database) Shutdown() {
	messagebus.Publish("DATABASE_SHUTDOWN", nil)
}
