package connection

// Handler ...
type Handler func(*ClientConnection, Message)

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
func (router *MessageRouter) Route(client *ClientConnection, message Message) {
	if handler, ok := router.routes[message.Type]; ok {
		handler(client, message)
	}
}
