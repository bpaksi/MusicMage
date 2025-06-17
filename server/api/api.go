package api

import (
	"net/http"

	"github.com/bpaksi/MusicMage/server/api/websocket"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

// StartAPI ...
func StartAPI() {

	http.Handle("/api", websocket.ServeHTTP())
}

// Shutdown ...
func Shutdown() {
	messagebus.Publish("API_SHUTDOWN", nil)
}

// ServeHTTP ...
