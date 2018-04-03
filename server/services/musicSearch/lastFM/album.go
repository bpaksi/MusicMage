package lastFM

import (
	"log"

	"github.com/bpaksi/MusicMage/server/services/musicSearch/data"
	"github.com/shkh/lastfm-go/lastfm"
)

// SearchForTracks ...
func (api *API) SearchForTracks(artist, album, id string) (results []*data.TrackRecord, err error) {
	p := lastfm.P{
		"artist": artist,
		"album":  album,
		"mbid":   id,

		"autocorrect": 1,
		"api_key":     apiKey}

	result, e := api.API.Album.GetInfo(p)
	if e != nil {
		err = e
		return
	}

	log.Printf("album search: %s", result.Artist)
	for _, track := range result.Tracks {
		p2 := lastfm.P{
			"artist":      result.Artist,
			"track":       track.Name,
			"mbid":        track.Mbid,
			"autocorrect": 1,
			"api_key":     apiKey}

		trackInfo, e2 := api.API.Track.GetInfo(p2)
		if e2 != nil {
			err = e2
			return
		}

		topTracks := ""
		for _, tag := range trackInfo.TopTags {
			if topTracks != "" {
				topTracks += ", "
			}
			topTracks += tag.Name
		}

		results = append(results, &data.TrackRecord{
			Artist:   track.Artist.Name,
			Name:     track.Name,
			Duration: trackInfo.Duration,
			TopTags:  topTracks,
			URL:      trackInfo.Url,
			Mbid:     track.Mbid,
		})
	}

	return
}
