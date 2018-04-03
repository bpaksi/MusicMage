package connection

import (
	"log"

	"github.com/bpaksi/MusicMage/server/services"
	"github.com/bpaksi/MusicMage/server/tools"
	"github.com/gorilla/websocket"
)

// Client ...
type Client struct {
	Services      services.Services
	Subscriptions *Subscriptions
	writeChannel  chan Message
	socket        *websocket.Conn
	routeHandler  RouteHandler
	identity      *tools.IdentityGenerator
}

// StartClient ...
func StartClient(socket *websocket.Conn, router RouteHandler, services services.Services) *Client {
	var client Client
	client.socket = socket
	client.routeHandler = router
	client.Services = services

	client.writeChannel = make(chan Message)
	client.Subscriptions = newSubscriptions()
	client.identity = tools.NewIdentityGenerator()

	stop := make(chan bool, 0)

	go client.writeData(stop)
	go client.readData(stop)

	log.Println("Client Connected")
	return &client
}

// Send ...
func (client *Client) Send(command string, payload interface{}) {
	message := Message{
		Type:    command,
		Payload: payload,
	}

	client.writeChannel <- message
}

// Error ...
func (client *Client) Error(message string) {
	client.Send("ERROR", message)
}

func (client *Client) readData(disconnected chan<- bool) {
	defer log.Println("Client.readData exited")
	var message Message
	for {
		err := client.socket.ReadJSON(&message)
		if err != nil {
			// log.Println("Client.readData error: " + err.Error())

			disconnected <- true
			return
		}

		// log.Printf("Client.readData %#v", message)

		client.safeRoute(message)
	}
}

func (client *Client) writeData(disconnected <-chan bool) {
	defer log.Println("Client.writeData exited")

	for {
		select {
		case msg := <-client.writeChannel:
			client.socket.WriteJSON(msg)

		case <-disconnected:
			client.Subscriptions.DisconnectAll()

			return
		}
	}

}

func (client *Client) safeRoute(message Message) {
	defer func() {
		if r := recover(); r != nil {
			client.Send("ERROR", r)
		}
	}()

	client.routeHandler(client, message)
}
