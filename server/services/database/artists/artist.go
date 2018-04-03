package artists

// Artist ...
type Artist struct {
	ID            int64  `json:"id"`
	Name          string `json:"name"`
	ArtistArtWork string `json:"artistArtwork"`
	AlbumName     string `json:"albumName"`
	SongCount     int    `json:"songCount"`
	AlbumArtWork  string `json:"albumArtwork"`
}
