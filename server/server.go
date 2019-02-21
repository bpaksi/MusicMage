package main

import (
	"log"
	"net/http"
	"os/user"
	"path"

	"github.com/bpaksi/MusicMage/server/services"
	"github.com/bpaksi/MusicMage/server/services/database"
	"github.com/bpaksi/MusicMage/server/services/musicSearch"

	"github.com/bpaksi/MusicMage/server/api"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("ERROR: %v", r)
		}
	}()

	log.Println("Music Mage server started")

	var services services.Services

	root := getRepositoryFolder()
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

func getRepositoryFolder() string {
	usr, err := user.Current()
	if err != nil {
		log.Fatal(err)
	}
	// fmt.Println(path.Join(usr.HomeDir, "/music/my music test"))

	return path.Join(usr.HomeDir, "/music/my music test")
}
