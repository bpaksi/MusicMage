package connection

import (
	"encoding/json"
	"log"

	"github.com/bpaksi/MusicMage/server/tools/messagebus"
	"github.com/gorilla/websocket"
)

type clientPayload struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload,omitempty"`
}

// Connection ...
type Connection struct {
	id           int64
	writeChannel chan clientPayload
	socket       *websocket.Conn
}

func newConnection(id int64, socket *websocket.Conn) *Connection {
	client := Connection{
		id:           id,
		socket:       socket,
		writeChannel: make(chan clientPayload),
	}

	stop := make(chan bool, 0)
	go client.writeData(stop)
	go client.readData(stop)

	log.Printf("Connection opened: %d", id)
	return &client
}

// Send ...
func (client *Connection) Send(msgType string, payload interface{}) {

	raw, err := json.Marshal(payload)
	if err != nil {
		log.Println("Error: " + err.Error())
		return
	}

	msg := clientPayload{
		Type:    msgType,
		Payload: raw,
	}

	client.writeChannel <- msg
}

func (client *Connection) readData(disconnected chan<- bool) {
	// defer log.Println("Connection.readData exited")

	for {
		var payload clientPayload
		err := client.socket.ReadJSON(&payload)
		if err != nil {
			log.Println("Connection.readData error: " + err.Error())

			disconnected <- true
			return
		}

		// log.Printf("Connection.readData %s, %s", payload.Type, payload.Payload)

		if !MessageWhitelist.Contains(payload.Type) {

			log.Printf("Non whitelisted message from Client: %d, %s\n", client.id, payload.Type)
			continue
		}

		msg := messagebus.Message{
			Type:     payload.Type,
			Payload:  payload.Payload,
			ClientID: client.id,
		}
		messagebus.PublishVerbose(msg)
	}
}

func (client *Connection) writeData(disconnected <-chan bool) {
	// defer log.Println("Connection.writeData exited")

	for {
		select {
		case msg := <-client.writeChannel:
			client.socket.WriteJSON(msg)

		case <-disconnected:
			messagebus.Publish("CLIENT_CONNECTION_CLOSED", client.id)

			return
		}
	}
}
