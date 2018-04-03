package artist

import (
	"log"

	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/services/database/artists"
)

// OnSubscribe ...
func OnSubscribe(client *connection.Client, message connection.Message) {
	if client.Subscriptions.Contains(subscriptionName) {
		return
	}

	filter := ""
	if message.Payload != nil {
		filter = message.Payload.(string)
	}

	// initialize client
	for _, artist := range client.Services.Database.Artists.Records {
		filterWrite(client, "ARTIST_ADDED", *artist, filter)
	}

	handlerKey := client.Services.Database.Artists.AddChangeHandler(func(oldArtist, newArtist artists.Artist) {
		if oldArtist.ID == 0 {
			filterWrite(client, "ARTIST_ADDED", newArtist, filter)
		} else if newArtist.ID == 0 {
			filterWrite(client, "ARTIST_DELETED", oldArtist, filter)
		} else {
			filterWrite(client, "ARTIST_UPDATED", newArtist, filter)
		}
	})

	client.Subscriptions.Track(subscriptionName, func() {
		log.Println("**Artist unsubscribe")

		client.Services.Database.Artists.RemoveChangeHandler(handlerKey)
	})
}

func filterWrite(client *connection.Client, command string, artist artists.Artist, artistName string) {
	found := true
	if len(artistName) > 0 {
		found = artistName == artist.Name
	}

	if found {
		client.Send(command, artist)
	}
}
