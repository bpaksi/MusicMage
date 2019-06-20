package artist

import (
	"log"

	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

const subscriptionName = "Artist"

func init() {
	messagebus.SubscribeWithClientID("ARTIST_SUBSCRIBE", onSubscribe)
	messagebus.SubscribeWithClientID("ARTIST_UNSUBSCRIBE", onUnsubscribe)

	connection.MessageWhitelist.Add("ARTIST_SUBSCRIBE")
	connection.MessageWhitelist.Add("ARTIST_UNSUBSCRIBE")
}

func onSubscribe(clientID int64, artist string) {
	log.Printf("artist.onSubscribe: %s (%d)", artist, clientID)

	connection.Subscriptions.Add(clientID, subscriptionName, artist)

	// all := database.GetArtists().All()

	// for _, artist := range all {

	// }
}

func onUnsubscribe(clientID int64) {
	log.Printf("artist.onUnsubscribe: %d", clientID)

	connection.Subscriptions.Remove(clientID, subscriptionName)

}

// func (artists *Artists) onFetchArtist(clientID int64, filter string) {
// 	filtered := artists.records
// 	if len(filter) > 0 {
// 		filtered = make([]Artist, 0)
// 		for _, artist := range artists.records {
// 			if artist.Name == filter {
// 				filtered = append(filtered, artist)
// 			}
// 		}
// 	}

// 	// messagebus.Publish("ARTISTS_FETCHED", filtered)
// }
