package artist

import "github.com/bpaksi/MusicMage/server/api/connection"

const subscriptionName = "Artist"

func init() {
	connection.Router.Handle("ARTIST_SUBSCRIBE", OnSubscribe)
	connection.Router.Handle("ARTIST_UNSUBSCRIBE", OnUnsubscribe)

}
