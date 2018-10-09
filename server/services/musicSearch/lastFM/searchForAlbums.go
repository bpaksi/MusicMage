package lastFM

import (
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

	// log.Printf("LastFM - artist search: %s, Album Cnt: %d", result.Artist, len(result.Albums))
	for _, album := range result.Albums {

		// log.Printf("\tLastFM - album: %s", album.Name)

		albumImageURL := ""
		if len(album.Images) > 0 {
			albumImageURL = album.Images[0].Url

			for _, img := range album.Images {
				if img.Size == "medium" {
					albumImageURL = img.Url
					break
				}
			}
		}

		results = append(results, data.AlbumRecord{
			Artist:           album.Artist.Name,
			ArtistInternalID: album.Artist.Mbid,
			ArtistURL:        album.Artist.Url,
			Album:            album.Name,
			AlbumInternalID:  album.Mbid,
			AlbumURL:         album.Url,
			AlbumImageURL:    albumImageURL,
			Source:           "LastFM",
		})
	}

	// log.Printf("LastFM - album cnt: %d", len(results))

	return
}
