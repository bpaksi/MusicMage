package api

import (
	"fmt"
	"net/http"

	"github.com/bpaksi/MusicMage/server/api/clientConnection"
	"github.com/bpaksi/MusicMage/server/catalog"
	"github.com/bpaksi/MusicMage/server/messages"
	"github.com/bpaksi/MusicMage/server/messages/catalogIndex"
	"github.com/gorilla/websocket"
)

// API ...
type API struct {
	upgrader websocket.Upgrader
	router   *messages.MessageRouter
	catalog  *catalog.Provider
}

// NewAPI ...
func NewAPI(catalog *catalog.Provider) *API {
	var api API
	api.upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}

	api.router = messages.NewMessageRouter()
	api.setupRoutes()

	api.catalog = catalog

	return &api
}

func (api *API) setupRoutes() {
	api.router.Handle("artist subscribe", catalogIndex.OnCatalogIndexSubscribe)
	api.router.Handle("artist unsubscribe", catalogIndex.OnCatalogIndexUnsubscribe)
}

// ServeHTTP ...
func (api *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	socket, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, err.Error())
		return
	}

	client := clientConnection.NewClient(api.catalog)
	client.Start(socket, api.router.Route)
}
