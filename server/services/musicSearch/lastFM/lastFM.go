package lastFM

// https://www.last.fm/api/intro

import (
	"github.com/shkh/lastfm-go/lastfm"
)

// API ...
type API struct {
	API *lastfm.Api
}

const apiKey = "c82b3e63aee20cdf6f18573aea13d1e2"
const apiSecret = "18e9c2593e1dd3f1f966fd8c907f2617"

// Login ...
func Login() (api *API) {
	api = &API{}
	api.API = lastfm.New(apiKey, apiSecret)

	return
}
