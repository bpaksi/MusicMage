package lastFM

import (
	"log"

	"github.com/bpaksi/MusicMage/server/services/musicSearch/data"
	"github.com/shkh/lastfm-go/lastfm"
)

// SearchForAlbums ...
func (api *API) SearchForAlbums(artist string) (results []data.AlbumRecord, err error) {
	p := lastfm.P{
		"artist":      artist,
		"autocorrect": 1,
		"api_key":     apiKey}
	result, e := api.API.Artist.GetTopAlbums(p)
	if e != nil {
		err = e
		return
	}

	log.Printf("artist search: %s, Album Cnt: %d", result.Artist, len(result.Albums))
	for _, album := range result.Albums {

		log.Printf("\talbum: %s", album.Name)

		results = append(results, data.AlbumRecord{
			Artist: album.Artist.Name,
			Name:   album.Name,
			URL:    album.Url,
			Mbid:   album.Mbid,
		})
	}

	log.Printf("album cnt: %d", len(results))

	return
}
