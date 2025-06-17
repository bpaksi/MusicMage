package unassigned

import (
	"log"

	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/services/database/songs"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

const subscriptionName = "Unassigned"

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
	messagebus.SubscribeWithClientID("UNASSIGNED_SUBSCRIBE", onSubscribe)
	messagebus.SubscribeWithClientID("UNASSIGNED_UNSUBSCRIBE", onUnsubscribe)
	messagebus.SubscribeWithClientID("UNASSIGNED_SAVE", onSave)

	messagebus.Subscribe("SONGS_FETCHED", onSongsFetched)
	// messagebus.Subscribe("SONG_CHANGED", onSongChanged)

	connection.MessageWhitelist.Add("UNASSIGNED_SUBSCRIBE")
	connection.MessageWhitelist.Add("UNASSIGNED_UNSUBSCRIBE")
	connection.MessageWhitelist.Add("UNASSIGNED_SAVE")

}

func onSubscribe(clientID int64) {
	connection.Subscriptions.Add(clientID, subscriptionName, nil)
	messagebus.Publish("SONGS_FETCH", nil)
}

func onUnsubscribe(clientID int64) {
	connection.Subscriptions.Remove(clientID, subscriptionName)
}

func onSave(clientID int64, songs []songs.Song) {
	log.Printf("unassigned.onSave: %d", len(songs))

}

func onSongsFetched(param songs.FetchResult) {
	subscriptions := connection.Subscriptions.List(subscriptionName)

	for _, subscription := range subscriptions {
		if param.Artist == "" {
			connection.Connections.Send(subscription.ClientID, "UNASSIGNED_FETCHED", param.Songs)
		}
	}
}

// func onSongChanged(param songs.SongChanged) {
// 	subscriptions := connection.Subscriptions.List(subscriptionName)

// 	for _, subscription := range subscriptions {
// 		filter := subscription.Data.(songs.FetchParam)

// 		if param.New.Artist == filter.Artist && param.New.Album == filter.Album {
// 			connection.Connections.Send(subscription.ClientID, "SONG_UPDATED", param.New)
// 		}
// 	}
// }
