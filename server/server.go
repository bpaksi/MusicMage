package main

import (
	"log"
	"net/http"
	"os/user"
	"path"

	"github.com/bpaksi/MusicMage/server/tools/logger"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"

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

	startDatabase()
	startWebServer()
	startStaticFileServer()

	http.ListenAndServe("localhost:4001", nil)
}

func startDatabase() {
	root := getRepositoryFolder()
	messagebus.Publish("DATABASE_STARTUP", root)
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

	path := path.Join(usr.HomeDir, "music", "my music test")
	// log.Printf("\tRepository path: %s", path)

	return path
}
