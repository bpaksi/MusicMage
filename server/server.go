package main

import (
	"log"
	"net/http"
	"os/user"
	"path"

	"github.com/bpaksi/MusicMage/server/services"
	"github.com/bpaksi/MusicMage/server/services/database"
	"github.com/bpaksi/MusicMage/server/services/musicSearch"
	"github.com/bpaksi/MusicMage/server/tools/logger"

	"github.com/bpaksi/MusicMage/server/api"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("ERROR: %v", r)
		}
	}()

	logger.Init()
	log.Println("Music Mage server started")

	var services services.Services

	root := getRepositoryFolder()
	services.Database = database.NewDatabase(root)
	services.Search = musicSearch.Create()

	startWebServer()
	startStaticFileServer()

	http.ListenAndServe("localhost:4001", nil)
}

func startWebServer() {
	api := api.NewAPI()

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
