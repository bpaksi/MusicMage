package files

import (
	"path/filepath"

	id3 "github.com/mikkyang/id3-go"
)

// MusicFile ...
type MusicFile struct {
	FullPath string

	artist string
	album  string
	title  string
	genre  string
	year   string
}

// OpenMusicFile ...
func OpenMusicFile(fullPath string) (musicFile *MusicFile, err error) {
	musicFile = &MusicFile{}
	musicFile.FullPath = fullPath

	var id3File *id3.File
	id3File, err = id3.Open(fullPath)
	if err == nil {
		musicFile.album = id3File.Album()
		musicFile.artist = id3File.Artist()
		musicFile.title = id3File.Title()
		musicFile.genre = id3File.Genre()
		musicFile.year = id3File.Year()
	}

	return
}

// Artist ...
func (musicFile *MusicFile) Artist() string {
	return musicFile.artist
}

// Album ...
func (musicFile *MusicFile) Album() string {
	return musicFile.album
}

// Title ...
func (musicFile *MusicFile) Title() string {
	return musicFile.title
}

// Genre ...
func (musicFile *MusicFile) Genre() string {
	return musicFile.genre
}

// Year ...
func (musicFile *MusicFile) Year() string {
	return musicFile.year
}

// SetAttributes ...
func (musicFile *MusicFile) SetAttributes(artist, album, title, genre, year string) (hasChanges bool, err error) {
	hasChanges = false

	var id3File *id3.File
	id3File, err = id3.Open(musicFile.FullPath)
	if err != nil {
		return
	}

	defer id3File.Close()

	if musicFile.Artist() != artist {
		id3File.SetArtist(artist)
		hasChanges = true
	}

	if id3File.Album() != album {
		id3File.SetAlbum(album)
		hasChanges = true
	}

	if id3File.Title() != title {
		id3File.SetTitle(title)
		hasChanges = true
	}

	if id3File.Genre() != genre {
		id3File.SetGenre(genre)
		hasChanges = true
	}

	if id3File.Year() != year {
		id3File.SetYear(year)
		hasChanges = true
	}

	musicFile.artist = artist
	musicFile.album = album
	musicFile.title = title
	musicFile.genre = genre
	musicFile.year = year

	return
}

// PreferredRelativePath ...
func (musicFile *MusicFile) PreferredRelativePath() string {
	return filepath.Join(
		musicFile.artist,
		musicFile.album,
		musicFile.title,
		filepath.Ext(musicFile.FullPath))
}

// HasChanges ...
func (musicFile *MusicFile) HasChanges(file *MusicFile) (hasChanges bool) {
	return musicFile.Artist() != file.Artist() ||
		musicFile.Album() != file.Album() ||
		musicFile.Title() != file.Title() ||
		musicFile.Genre() != file.Genre() ||
		musicFile.Year() != file.Year()
}
