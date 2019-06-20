package connection

import (
	"log"
	"sync"

	"github.com/bpaksi/MusicMage/server/tools"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
	"github.com/gorilla/websocket"
)

// ConnectionsList ...
type ConnectionsList struct {
	lock     sync.RWMutex
	all      map[int64]*Connection
	identity *tools.IdentityGenerator
}

// Connections ...
var Connections *ConnectionsList

func init() {
	Connections = &ConnectionsList{
		all:      make(map[int64]*Connection, 0),
		identity: tools.NewIdentityGenerator(),
	}

	messagebus.Subscribe("CLIENT_CONNECTION_CLOSED", Connections.onConnectionClosed)
}

// Add ...
func (obj *ConnectionsList) Add(socket *websocket.Conn) (err error) {
	clientID := obj.identity.Next()
	connection := newConnection(clientID, socket)

	obj.lock.Lock()
	defer obj.lock.Unlock()

	obj.all[clientID] = connection
	return
}

// Broadcast ...
func (obj *ConnectionsList) Broadcast(clientIDs []int64, msgType string, payload interface{}) (err error) {
	obj.lock.RLock()
	defer obj.lock.RUnlock()

	for _, clientID := range clientIDs {
		if connection, ok := obj.all[clientID]; ok {
			connection.Send(msgType, payload)
		}
	}

	return
}

func (obj *ConnectionsList) onConnectionClosed(clientID int64) {
	obj.lock.Lock()
	defer obj.lock.Unlock()

	log.Printf("Connection closed: %d\n", clientID)

	if _, ok := obj.all[clientID]; !ok {
		log.Printf("No connection with ID %d exists\n", clientID)
		return
	}

	delete(obj.all, clientID)
	return
}
