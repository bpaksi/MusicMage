package lastFM

// https://www.last.fm/api/intro

import (
	"github.com/bpaksi/MusicMage/server/config"
	"github.com/shkh/lastfm-go/lastfm"
)

// API ...
type API struct {
	API *lastfm.Api
}

// Login creates a Last.fm client using LASTFM_API_KEY and LASTFM_API_SECRET.
func Login() (api *API, err error) {
	apiKey, apiSecret, err := config.Credentials("LASTFM_API_KEY", "LASTFM_API_SECRET")
	if err != nil {
		return nil, err
	}

	api = &API{}
	api.API = lastfm.New(apiKey, apiSecret)

	return
}
