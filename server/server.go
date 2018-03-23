package main

import (
	"log"
	"net/http"

	"github.com/bpaksi/MusicMage/server/api"
	"github.com/bpaksi/MusicMage/server/database"
)

func main() {
	log.Println("Music Mage server started")

	root := "/users/bobpaksi/music/my music test"
	database := database.NewDatabase(root)

	startWebServer(database)
	startStaticFileServer()

	http.ListenAndServe("localhost:4000", nil)
}

func startWebServer(database *database.Database) {
	api := api.NewAPI(database)

	http.Handle("/api", api)
}

func startStaticFileServer() {
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./static"))))
}
