package album

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/services/database/songs"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

const subscriptionName = "Album"

// SongRecord ...
type SongRecord struct {
	ID     int64  `json:"id"`
	Artist string `json:"artist"`
	Album  string `json:"album"`
	Title  string `json:"title"`
	Genre  string `json:"genre"`
	Year   string `json:"year"`
}

func init() {
	messagebus.SubscribeWithClientID("ALBUM_SUBSCRIBE", onSubscribe)
	messagebus.SubscribeWithClientID("ALBUM_UNSUBSCRIBE", onUnsubscribe)
	messagebus.Subscribe("SONGS_FETCHED", onSongsFetched)

	connection.MessageWhitelist.Add("ALBUM_SUBSCRIBE")
	connection.MessageWhitelist.Add("ALBUM_UNSUBSCRIBE")
}

func onSubscribe(clientID int64, param songs.FetchParam) {
	connection.Subscriptions.Add(clientID, subscriptionName, param)
	messagebus.Publish("SONGS_FETCH", param)
}

func onUnsubscribe(clientID int64) {
	connection.Subscriptions.Remove(clientID, subscriptionName)
}

func onSongsFetched(param songs.FetchResult) {
	subscriptions := connection.Subscriptions.List(subscriptionName)

	for _, subscription := range subscriptions {
		filter := subscription.Data.(songs.FetchParam)

		if param.Artist == filter.Artist && param.Album == filter.Album {
			connection.Connections.Send(subscription.ClientID, "ALBUM_FETCHED", param.Songs)
		}
	}
}
