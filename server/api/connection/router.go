package connection

// RouteHandler ...
type RouteHandler func(*Client, Message)

// Router ...
type Router struct {
	routes map[string]RouteHandler
}

// NewRouter ...
func NewRouter() *Router {
	var router Router
	router.routes = make(map[string]RouteHandler)

	return &router
}

// Handle ...
func (router *Router) Handle(name string, handler RouteHandler) {
	router.routes[name] = handler
}

// Route ...
func (router *Router) Route(client *Client, message Message) {
	if handler, ok := router.routes[message.Type]; ok {
		handler(client, message)
	}
}
