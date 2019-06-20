package unassigned

const subscriptionName = "Unassigned"

// UnassignedRecord ...
type UnassignedRecord struct {
	ID              int64  `json:"id"`
	FullPath        string `json:"fullpath"`
	SuggestedArtist string `json:"suggestedArtist"`
	SuggestedAlbum  string `json:"suggestedAlbum"`
	SuggestedTitle  string `json:"suggestedTitle"`
	Artist          string `json:"artist"`
	Album           string `json:"album"`
	Title           string `json:"title"`
}

// func init() {
// 	connection.Router.Handle("UNASSIGNED_SUBSCRIBE", OnSubscribe)
// 	connection.Router.Handle("UNASSIGNED_UNSUBSCRIBE", OnUnsubscribe)
// }
