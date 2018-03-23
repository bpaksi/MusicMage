package api

import (
	"fmt"
	"net/http"

	"github.com/bpaksi/MusicMage/server/api/command/album"
	"github.com/bpaksi/MusicMage/server/api/command/artist"
	"github.com/bpaksi/MusicMage/server/api/command/genre"
	"github.com/bpaksi/MusicMage/server/api/command/song"
	"github.com/bpaksi/MusicMage/server/api/connection"
	"github.com/bpaksi/MusicMage/server/database"
	"github.com/gorilla/websocket"
)

// API ...
type API struct {
	upgrader websocket.Upgrader
	router   *connection.MessageRouter
	database *database.Database
}

// NewAPI ...
func NewAPI(database *database.Database) *API {
	var api API
	api.upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}

	api.router = connection.NewMessageRouter()
	api.setupRoutes()

	api.database = database

	return &api
}

func (api *API) setupRoutes() {
	api.router.Handle("ARTIST_SUBSCRIBE", artist.OnSubscribe)
	api.router.Handle("ARTIST_UNSUBSCRIBE", artist.OnUnsubscribe)

	api.router.Handle("ALBUM_SUBSCRIBE", album.OnSubscribe)
	api.router.Handle("ALBUM_UNSUBSCRIBE", album.OnUnsubscribe)

	api.router.Handle("SONG_UPDATE", song.OnUpdate)
	api.router.Handle("SONG_DELETE", song.OnDelete)

	api.router.Handle("FETCH_GENRES", genre.Fetch)
}

// ServeHTTP ...
func (api *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	socket, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, err.Error())
		return
	}

	client := connection.NewClient(api.database)
	client.Start(socket, api.router.Route)
}
