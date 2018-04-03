package data

// TrackRecord ...
type TrackRecord struct {
	Artist   string `json:"artist"`
	Name     string `json:"name"`
	Duration string `json:"duration"`
	TopTags  string `json:"topTags"`
	URL      string `json:"url"`
	Mbid     string `json:"mbid"`
}
