package genres

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

const subscriptionName = "Genres"

// SongRecord ...

func init() {
	messagebus.SubscribeWithClientID("GENRES_SUBSCRIBE", onSubscribe)
	messagebus.SubscribeWithClientID("GENRES_UNSUBSCRIBE", onUnsubscribe)
	messagebus.Subscribe("GENRES_UPDATED", onUpdated)

	connection.MessageWhitelist.Add("GENRES_SUBSCRIBE")
	connection.MessageWhitelist.Add("GENRES_UNSUBSCRIBE")
}

func onSubscribe(clientID int64) {
	connection.Subscriptions.Add(clientID, subscriptionName, nil)
	messagebus.Publish("GENRES_FETCH", nil)
}

func onUnsubscribe(clientID int64) {
	connection.Subscriptions.Remove(clientID, subscriptionName)
}

func onUpdated(genres []string) {
	subscriptions := connection.Subscriptions.List(subscriptionName)

	for _, subscription := range subscriptions {
		connection.Connections.Send(subscription.ClientID, "GENRES_UPDATED", genres)
	}
}
