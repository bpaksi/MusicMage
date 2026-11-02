package spotify

// https://developer.spotify.com/web-api/

import (
	"context"
	"log"

	"github.com/bpaksi/MusicMage/server/config"
	"golang.org/x/oauth2"

	"github.com/zmb3/spotify"
	"golang.org/x/oauth2/clientcredentials"
)

// API ...
type API struct {
	token  *oauth2.Token
	client spotify.Client
}

// Login creates a Spotify client using SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.
func Login() (api *API, err error) {
	clientID, clientSecret, err := config.Credentials("SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET")
	if err != nil {
		return nil, err
	}

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
