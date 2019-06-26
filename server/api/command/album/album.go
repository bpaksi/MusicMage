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
	messagebus.SubscribeWithClientID("ALBUM_SAVE", onSave)
	messagebus.Subscribe("SONGS_FETCHED", onSongsFetched)
	messagebus.Subscribe("SONG_CHANGED", onSongChanged)

	connection.MessageWhitelist.Add("ALBUM_SUBSCRIBE")
	connection.MessageWhitelist.Add("ALBUM_UNSUBSCRIBE")
	connection.MessageWhitelist.Add("ALBUM_SAVE")

}

func onSubscribe(clientID int64, param songs.FetchParam) {
	connection.Subscriptions.Add(clientID, subscriptionName, param)
	messagebus.Publish("SONGS_FETCH", param)
}

func onUnsubscribe(clientID int64) {
	connection.Subscriptions.Remove(clientID, subscriptionName)
}

func onSave(clientID int64, songs []songs.Song) {
	// log.Printf("album.onSave: %d", len(songs))

	for _, song := range songs {
		messagebus.Publish("SONG_UPDATE", song)
	}
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

func onSongChanged(param songs.SongChanged) {
	subscriptions := connection.Subscriptions.List(subscriptionName)

	for _, subscription := range subscriptions {
		filter := subscription.Data.(songs.FetchParam)

		if param.New.Artist == filter.Artist && param.New.Album == filter.Album {
			connection.Connections.Send(subscription.ClientID, "SONG_UPDATED", param.New)
		}
	}
}
