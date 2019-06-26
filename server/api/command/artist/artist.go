package album

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/services/database/albums"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

const subscriptionName = "Artist"

func init() {
	messagebus.SubscribeWithClientID("ARTIST_SUBSCRIBE", onSubscribe)
	messagebus.SubscribeWithClientID("ARTIST_UNSUBSCRIBE", onUnsubscribe)
	messagebus.Subscribe("ALBUMS_FETCHED", onAlbumsFetched)

	connection.MessageWhitelist.Add("ARTIST_SUBSCRIBE")
	connection.MessageWhitelist.Add("ARTIST_UNSUBSCRIBE")
}

func onSubscribe(clientID int64, artist string) {
	connection.Subscriptions.Add(clientID, subscriptionName, artist)
	messagebus.Publish("ALBUMS_FETCH", nil)
}

func onUnsubscribe(clientID int64) {
	connection.Subscriptions.Remove(clientID, subscriptionName)
}

func onAlbumsFetched(list []albums.Album) {
	subscriptions := connection.Subscriptions.List(subscriptionName)

	for _, subscription := range subscriptions {
		albumName := subscription.Data.(string)

		filtered := list
		if albumName != "" {
			filtered = make([]albums.Album, 0)
			for _, album := range list {
				if album.AlbumName == albumName {
					filtered = append(filtered, album)
				}
			}
		}

		connection.Connections.Send(subscription.ClientID, "ARTISTS_FETCHED", filtered)
	}
}
