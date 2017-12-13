package catalog

import (
	"github.com/bpaksi/MusicMage/server/catalog/artists"
	"github.com/bpaksi/MusicMage/server/catalog/songs"
)

// Provider ...
type Provider struct {
	Songs   *songs.Songs
	Artists *artists.Artists
}

// NewCatalog ...
func NewCatalog() *Provider {
	var provider Provider

	root := "/Users/bobpaksi/Documents/MusicMage/Test"

	provider.Songs = songs.NewSongDatabase()
	provider.Artists = artists.NewArtistDatabase(provider.Songs)
	provider.Songs.Open(root)

	return &provider
}
