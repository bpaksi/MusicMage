package album

import (
	"github.com/bpaksi/MusicMage/server/api/connection"
)

// OnUnsubscribe ...
func OnUnsubscribe(client *connection.Client, message connection.Message) {
	client.Subscriptions.Disconnect(subscriptionName)
}
