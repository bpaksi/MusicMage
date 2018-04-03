package main

import (
	"log"
	"net/http"

	"github.com/bpaksi/MusicMage/server/services"
	"github.com/bpaksi/MusicMage/server/services/database"
	"github.com/bpaksi/MusicMage/server/services/musicSearch"

	"github.com/bpaksi/MusicMage/server/api"
)

func main() {
	log.Println("Music Mage server started")

	var services services.Services

	root := "/users/bobpaksi/music/my music test"
	services.Database = database.NewDatabase(root)
	services.Search = musicSearch.Create()

	startWebServer(services)
	startStaticFileServer()

	http.ListenAndServe("localhost:4000", nil)
}

func startWebServer(services services.Services) {
	api := api.NewAPI(services)

	http.Handle("/api", api)
}

func startStaticFileServer() {
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./static"))))
}
