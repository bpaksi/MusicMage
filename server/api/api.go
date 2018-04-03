package api

import (
	"fmt"
	"net/http"

	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/services"
	"github.com/gorilla/websocket"

	// allow commands to register themselves
	_ "github.com/bpaksi/MusicMage/server/api/command/album"
	_ "github.com/bpaksi/MusicMage/server/api/command/artist"
	_ "github.com/bpaksi/MusicMage/server/api/command/folder"
	_ "github.com/bpaksi/MusicMage/server/api/command/genre"
	_ "github.com/bpaksi/MusicMage/server/api/command/search"
	_ "github.com/bpaksi/MusicMage/server/api/command/song"
)

// API ...
type API struct {
	upgrader websocket.Upgrader
	services services.Services
}

// NewAPI ...
func NewAPI(services services.Services) *API {
	var api API
	api.upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}

	api.services = services
	return &api
}

// ServeHTTP ...
func (api *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	socket, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, err.Error())
		return
	}

	connection.StartClient(socket, api.services)
}
