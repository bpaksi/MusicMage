package database

import (
	"log"
	"os/user"
	"path"

	// allow database services to register themselves
	_ "github.com/bpaksi/MusicMage/server/services/database/genres"
	_ "github.com/bpaksi/MusicMage/server/services/database/songs"
	_ "github.com/bpaksi/MusicMage/server/services/database/watcher"

	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

// StartDatabase ...
func StartDatabase() {
	usr, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}

	path := path.Join(usr.HomeDir, "music", "my music test")
	messagebus.Publish("DATABASE_STARTUP", path)
}

// Shutdown ...
func Shutdown() {
	messagebus.Publish("DATABASE_SHUTDOWN", nil)
}
