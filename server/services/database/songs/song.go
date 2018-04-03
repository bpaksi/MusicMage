package songs

import "github.com/bpaksi/MusicMage/server/services/database/files"

// Song ...
type Song struct {
	ID   int64
	File *files.MusicFile
}
