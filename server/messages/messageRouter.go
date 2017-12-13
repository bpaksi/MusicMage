package messages

import "github.com/bpaksi/MusicMage/server/api/clientConnection"

// Handler ...
type Handler func(*clientConnection.ClientConnection, interface{})

// MessageRouter ...
type MessageRouter struct {
	routes map[string]Handler
}

// NewMessageRouter ...
func NewMessageRouter() *MessageRouter {
	var router MessageRouter
	router.routes = make(map[string]Handler)

	return &router
}

// Handle ...
func (router *MessageRouter) Handle(name string, handler Handler) {
	router.routes[name] = handler
}

// Route ...
func (router *MessageRouter) Route(client *clientConnection.ClientConnection, message clientConnection.Message) {
	if handler, ok := router.routes[message.Name]; ok {
		handler(client, message)
	}
}
