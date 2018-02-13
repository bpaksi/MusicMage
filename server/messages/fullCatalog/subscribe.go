package catalogIndex

import (
	"log"

	"github.com/bpaksi/MusicMage/server/api/clientConnection"
	"github.com/bpaksi/MusicMage/server/catalog/songs"
)

// OnCatalogIndexSubscribe ...
func OnCatalogIndexSubscribe(client *clientConnection.ClientConnection, data interface{}) {
	log.Println("OnCatalogIndexSubscribe")

	if _, ok := client.FindSubscription(subscriptionName); ok {
		return
	}

	// initialize client
	for _, artist := range client.Catalog.Artists.Records {
		client.Write(clientConnection.Message{
			Name: "artist add",
			Data: artist,
		})
	}

	handlerKey := client.Catalog.Artists.AddChangeHandler(func(oldArtist, newArtist artists.Artist) {
		if oldArtist.ID == 0 {
			client.Write(clientConnection.Message{
				Name: "artist add",
				Data: newArtist,
			})
		} else if newArtist.ID == 0 {
			client.Write(clientConnection.Message{
				Name: "artist delete",
				Data: oldArtist,
			})
		} else {
			client.Write(clientConnection.Message{
				Name: "artist update",
				Data: newArtist,
			})
		}
	})

	sub := client.TrackSubscription(subscriptionName)
	sub.UnsubscribeHander = func() {
		log.Println("**OnCatalogIndexSubscribe - remove change handler")

		client.Catalog.Artists.RemoveChangeHandler(handlerKey)
	}

}

// OnCatalogIndexUnsubscribe ...
func OnCatalogIndexUnsubscribe(client *clientConnection.ClientConnection, data interface{}) {
	log.Println("OnCatalogIndexUnsubscribe")

	if _, ok := client.FindSubscription(subscriptionName); ok {
		client.DisconnectSubscription(subscriptionName)
	}
}
