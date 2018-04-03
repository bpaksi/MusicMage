package services

import (
	"github.com/bpaksi/MusicMage/server/services/database"
	"github.com/bpaksi/MusicMage/server/services/musicSearch"
)

// Services ...
type Services struct {
	Database *database.Database
	Search   *musicSearch.MusicSearch
}
