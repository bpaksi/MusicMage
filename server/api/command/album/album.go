package album

const subscriptionName = "Album"

// SongRecord ...
type SongRecord struct {
	ID     int64  `json:"id"`
	Artist string `json:"artist"`
	Album  string `json:"album"`
	Title  string `json:"title"`
	Genre  string `json:"genre"`
	Year   string `json:"year"`
}
