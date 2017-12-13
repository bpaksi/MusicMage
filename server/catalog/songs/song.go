package songs

// Song ...
type Song struct {
	ID           int64
	RelativePath string

	file *MusicFile
}

// Artist ...
func (song *Song) Artist() string {
	return song.file.Artist()
}

// Album ...
func (song *Song) Album() string {
	return song.file.Album()
}

// Title ...
func (song *Song) Title() string {
	return song.file.Title()
}

// Genre ...
func (song *Song) Genre() string {
	return song.file.Genre()
}

// Year ...
func (song *Song) Year() string {
	return song.file.Year()
}

// HasChanges ...
func (song *Song) HasChanges(file *MusicFile) (hasChanges bool) {
	return file.Artist() != song.file.Artist() ||
		file.Album() != song.file.Album() ||
		file.Title() != song.file.Title() ||
		file.Genre() != song.file.Genre() ||
		file.Year() != song.file.Year()
}
