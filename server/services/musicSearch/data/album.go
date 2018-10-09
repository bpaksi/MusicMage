package data

import "strings"

// AlbumRecord ...
type AlbumRecord struct {
	Artist           string `json:"artist"`
	ArtistInternalID string `json:"artistInternalID"`
	ArtistURL        string `json:"artistUrl"`
	Album            string `json:"album"`
	AlbumInternalID  string `json:"albumInternalID"`
	AlbumURL         string `json:"albumURL"`
	AlbumImageURL    string `json:"albumImageUrl"`
	Source           string `json:"source"`
}

// AlbumRecords ...
type AlbumRecords []AlbumRecord

func (ar AlbumRecords) Len() int {
	return len(ar)
}

func (ar AlbumRecords) Swap(i, j int) {
	ar[i], ar[j] = ar[j], ar[i]
}

func (ar AlbumRecords) Less(i, j int) bool {
	compare := strings.Compare(ar[i].Artist, ar[j].Artist)
	if compare == 0 {
		compare = strings.Compare(ar[i].Album, ar[j].Album)
	}

	return compare < 0
}
