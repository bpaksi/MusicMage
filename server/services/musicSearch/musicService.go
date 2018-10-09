package musicSearch

import (
	"sort"

	"github.com/bpaksi/MusicMage/server/services/musicSearch/data"
	"github.com/bpaksi/MusicMage/server/services/musicSearch/lastFM"
	"github.com/bpaksi/MusicMage/server/services/musicSearch/spotify"
)

// MusicSearch ...
type MusicSearch struct {
	lastFM  *lastFM.API
	spotify *spotify.API
}

// Create ...
func Create() (musicSearch *MusicSearch) {
	musicSearch = &MusicSearch{}
	musicSearch.lastFM = lastFM.Login()
	musicSearch.spotify, _ = spotify.Login()

	return
}

// SearchForTracks ...
func (musicSearch *MusicSearch) SearchForTracks(artist, album, id string) (results []*data.TrackRecord, err error) {

	results, err = musicSearch.lastFM.SearchForTracks(artist, album, id)

	return
}

// SearchForAlbums ...
func (musicSearch *MusicSearch) SearchForAlbums(artist string) (results data.AlbumRecords, err error) {
	lastFM, lastFMerr := musicSearch.lastFM.SearchForAlbums(artist)
	spotify, spotifyerr := musicSearch.spotify.SearchForAlbums(artist)

	if lastFMerr != nil {
		err = lastFMerr
	} else if spotifyerr != nil {
		err = spotifyerr
	} else {

		results = append(lastFM, spotify...)

		sort.Sort(results)
	}
	return
}
