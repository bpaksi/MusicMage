package songs

import (
	"path/filepath"

	id3 "github.com/mikkyang/id3-go"
)

// Song ...
type Song struct {
	ID       int64 `json:"id"`
	FullPath string
	Artist   string `json:"artist"`
	Album    string `json:"album"`
	Title    string `json:"title"`
	Genre    string `json:"genre"`
	Year     string `json:"year"`
}

// OpenMusicFile ...
func OpenMusicFile(fullPath string) (song Song, err error) {
	song = Song{
		FullPath: fullPath,
	}

	var id3File *id3.File
	id3File, err = id3.Open(fullPath)
	if err == nil {
		song.Album = id3File.Album()
		song.Artist = id3File.Artist()
		song.Title = id3File.Title()
		song.Genre = id3File.Genre()
		song.Year = id3File.Year()
	}

	return
}

// SaveChanges ...
func (song *Song) SaveChanges() (hasChanges bool, err error) {
	hasChanges = false

	var id3File *id3.File
	id3File, err = id3.Open(song.FullPath)
	if err != nil {
		return
	}

	defer id3File.Close()

	if id3File.Artist() != song.Artist {
		id3File.SetArtist(song.Artist)
		hasChanges = true
	}

	if id3File.Album() != song.Album {
		id3File.SetAlbum(song.Album)
		hasChanges = true
	}

	if id3File.Title() != song.Title {
		id3File.SetTitle(song.Title)
		hasChanges = true
	}

	if id3File.Genre() != song.Genre {
		id3File.SetGenre(song.Genre)
		hasChanges = true
	}

	if id3File.Year() != song.Year {
		id3File.SetYear(song.Year)
		hasChanges = true
	}

	return
}

// PreferredRelativePath ...
func (song *Song) PreferredRelativePath() string {
	return filepath.Join(
		song.Artist,
		song.Album,
		song.Title,
		filepath.Ext(song.FullPath))
}

// HasChanges ...
func (song *Song) HasChanges(file *Song) (hasChanges bool) {
	return song.Artist != file.Artist ||
		song.Album != file.Album ||
		song.Title != file.Title ||
		song.Genre != file.Genre ||
		song.Year != file.Year
}
