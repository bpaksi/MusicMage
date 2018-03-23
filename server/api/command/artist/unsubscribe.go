package artist

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
)

// OnUnsubscribe ...
func OnUnsubscribe(client *connection.ClientConnection, message connection.Message) {
	client.DisconnectSubscription(subscriptionName)
}
