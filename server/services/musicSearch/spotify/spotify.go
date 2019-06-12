package spotify

// https://developer.spotify.com/web-api/

import (
	"context"
	"log"

	"golang.org/x/oauth2"

	"github.com/zmb3/spotify"
	"golang.org/x/oauth2/clientcredentials"
)

const clientID = "936439a9c5344f10a9d19f1dae1d8994"
const clientSecret = "e3b355dec67d488481435a01bb95804c"

// API ...
type API struct {
	token  *oauth2.Token
	client spotify.Client
}

// Login ...
func Login() (api *API, err error) {
	api = &API{}

	config := &clientcredentials.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		TokenURL:     spotify.TokenURL,
	}
	api.token, err = config.Token(context.Background())
	if err != nil {
		log.Fatalf("couldn't get token: %v", err)
		return
	}

	api.client = spotify.Authenticator{}.NewClient(api.token)
	return
}
