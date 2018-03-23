package connection

import (
	"log"

	"github.com/bpaksi/MusicMage/server/database"

	"github.com/bpaksi/MusicMage/server/tools"
	"github.com/gorilla/websocket"
)

// Message ...
type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

// ClientRouteHandler ...
type ClientRouteHandler func(*ClientConnection, Message)

// ClientDisconnectHandler ...
type ClientDisconnectHandler func()

// ClientConnection ...
type ClientConnection struct {
	writeChannel  chan Message
	socket        *websocket.Conn
	routeHandler  ClientRouteHandler
	subscriptions []Subscription
	identity      *tools.IdentityGenerator
	Database      *database.Database
}

// NewClient ...
func NewClient(database *database.Database) *ClientConnection {
	var client ClientConnection
	client.writeChannel = make(chan Message)
	client.subscriptions = make([]Subscription, 0)
	client.identity = tools.NewIdentityGenerator()

	client.Database = database
	return &client
}

// Start ...
func (c *ClientConnection) Start(socket *websocket.Conn, router ClientRouteHandler) {
	c.socket = socket
	c.routeHandler = router

	stop := make(chan bool, 0)

	go c.writeData(stop)
	go c.readData(stop)

	log.Println("Client Connected")
}

func (c *ClientConnection) Write(message Message) {
	c.writeChannel <- message
}

// ContainsSubscription ...
func (c *ClientConnection) ContainsSubscription(name string) bool {
	for _, sub := range c.subscriptions {
		if sub.Name == name {
			return true
		}
	}

	return false
}

// TrackSubscription ...
func (c *ClientConnection) TrackSubscription(name string, unsubscribe SubscriptionUnsubscribeHandler) *Subscription {
	var newSubscription Subscription
	newSubscription.Name = name
	newSubscription.UnsubscribeHander = unsubscribe
	c.subscriptions = append(c.subscriptions, newSubscription)

	return &c.subscriptions[len(c.subscriptions)-1]
}

// DisconnectSubscription ...
func (c *ClientConnection) DisconnectSubscription(name string) {
	for idx, subscription := range c.subscriptions {
		if subscription.Name == name {
			subscription.Unsubscribe()

			c.subscriptions = append(c.subscriptions[:idx], c.subscriptions[idx+1:]...)
			break
		}
	}

}

func (c *ClientConnection) readData(disconnected chan<- bool) {
	defer log.Println("Client.readData exited")
	var message Message
	for {
		err := c.socket.ReadJSON(&message)
		if err != nil {
			// log.Println("ClientConnection.readData error: " + err.Error())

			disconnected <- true
			return
		}

		// log.Printf("ClientConnection.readData %#v", message)

		c.routeHandler(c, message)
	}
}

func (c *ClientConnection) writeData(disconnected <-chan bool) {
	defer log.Println("Client.writeData exited")

	for {
		select {
		case msg := <-c.writeChannel:
			c.socket.WriteJSON(msg)

		case <-disconnected:

			for _, subscription := range c.subscriptions {
				subscription.Unsubscribe()
			}

			return
		}
	}

}
