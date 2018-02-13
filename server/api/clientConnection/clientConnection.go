package clientConnection

import (
	"log"

	"github.com/bpaksi/MusicMage/server/catalog"

	"github.com/bpaksi/MusicMage/server/tools"
	"github.com/gorilla/websocket"
)

// Message ...
type Message struct {
	Name string      `json:"name"`
	Data interface{} `json:"data"`
}

// ClientRouteHandler ...
type ClientRouteHandler func(*ClientConnection, Message)

// ClientDisconnectHandler ...
type ClientDisconnectHandler func()

// ClientConnection ...
type ClientConnection struct {
	writeChannel chan Message
	socket       *websocket.Conn

	routeHandler ClientRouteHandler

	subscriptions []Subscription
	identity      *tools.IdentityGenerator

	Catalog *catalog.Provider
}

// NewClient ...
func NewClient(catalog *catalog.Provider) *ClientConnection {
	var client ClientConnection
	client.writeChannel = make(chan Message)
	client.subscriptions = make([]Subscription, 0)
	client.identity = tools.NewIdentityGenerator()

	client.Catalog = catalog
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

// TrackSubscription ...
func (c *ClientConnection) TrackSubscription(name string) *Subscription {
	var newSubscription Subscription
	newSubscription.Name = name
	c.subscriptions = append(c.subscriptions, newSubscription)

	return &c.subscriptions[len(c.subscriptions)-1]
}

// FindSubscription ...
func (c *ClientConnection) FindSubscription(name string) (subcription *Subscription, ok bool) {
	ok = false

	for idx, sub := range c.subscriptions {
		if sub.Name == name {
			ok = true
			subcription = &c.subscriptions[idx]
			break
		}
	}

	return
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
		if err := c.socket.ReadJSON(&message); err != nil {

			log.Println("ClientConnection.readData error: " + err.Error())

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
