package connection

import (
	"encoding/json"
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
	identity      *tools.IdentityGenerator
}

// StartClient ...
func StartClient(socket *websocket.Conn, services services.Services) *Client {
	var client Client
	client.socket = socket
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
	client.SendWithReturnKey(command, "", payload)
}

// SendWithReturnKey ...
func (client *Client) SendWithReturnKey(command string, returnKey string, payload interface{}) {

	raw, err := json.Marshal(payload)
	if err != nil {
		log.Println("Error: " + err.Error())
	}

	message := Message{
		Type:      command,
		ReturnKey: returnKey,
		Payload:   raw,
	}

	client.writeChannel <- message
}

// Error ...
func (client *Client) Error(message string) {
	client.Send("ERROR", message)
}

func (client *Client) readData(disconnected chan<- bool) {
	defer log.Println("Client.readData exited")
	for {
		var message Message
		err := client.socket.ReadJSON(&message)
		if err != nil {
			log.Println("Client.readData error: " + err.Error())

			disconnected <- true
			return
		}

		// log.Printf("Client.readData %s", message.Type)

		client.route(message)
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

func (client *Client) route(message Message) {
	defer func() {
		if r := recover(); r != nil {
			client.Send("ERROR", r)
		}
	}()

	if err := Router.Route(client, message); err != nil {
		log.Println(err.Error())
	}
}
