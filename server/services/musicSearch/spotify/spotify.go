package spotify

import (
	"context"
	"log"

	"golang.org/x/oauth2"

	"github.com/zmb3/spotify"
	"golang.org/x/oauth2/clientcredentials"
)

const clientID = "936439a9c5344f10a9d19f1dae1d8994"
const clientSecret = "e241466f1e784089810342a08458ded8"

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
