package artists

// Artist ...
type Artist struct {
	ID        int64  `json:"id"`
	Album     string `json:"album"`
	Artist    string `json:"artist"`
	SongCount int    `json:"songCount"`
}
