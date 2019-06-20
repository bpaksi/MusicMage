package api

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"

	// allow commands to register themselves
	_ "github.com/bpaksi/MusicMage/server/api/command/album"
	_ "github.com/bpaksi/MusicMage/server/api/command/artist"
	_ "github.com/bpaksi/MusicMage/server/api/command/folder"
	_ "github.com/bpaksi/MusicMage/server/api/command/search"
	_ "github.com/bpaksi/MusicMage/server/api/command/song"
	_ "github.com/bpaksi/MusicMage/server/api/command/unassigned"
	"github.com/bpaksi/MusicMage/server/api/connection"
)

// API ...
type API struct {
	upgrader websocket.Upgrader
}

// NewAPI ...
func NewAPI() http.Handler {
	var api API
	api.upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}
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

	connection.Connections.Add(socket)
}
