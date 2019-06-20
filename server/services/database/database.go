package database

import (
	"github.com/bpaksi/MusicMage/server/services/database/artists"

	// allow database services to register themselves
	_ "github.com/bpaksi/MusicMage/server/services/database/songs"
	_ "github.com/bpaksi/MusicMage/server/services/database/watcher"
)

// Artists ...
type Artists interface {
	All() []artists.Artist
}

// GetArtists ...
func GetArtists() Artists {
	return artists.Artists
}
