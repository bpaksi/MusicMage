package main

import (
	"fmt"
	"net/http"

	"github.com/bpaksi/MusicMage/server/api"
	"github.com/bpaksi/MusicMage/server/catalog"
)

func main() {
	fmt.Println("Music Mage server started")

	startWebServer()

}

func startWebServer() {
	catalog := catalog.NewCatalog()
	api := api.NewAPI(catalog)

	http.Handle("/api", api)
	http.ListenAndServe("localhost:4000", nil)
}

// func waitForCtrlC() {
// 	var endWaiter sync.WaitGroup
// 	endWaiter.Add(1)
// 	var signalChannel chan os.Signal
// 	signalChannel = make(chan os.Signal, 1)
// 	signal.Notify(signalChannel, os.Interrupt)
// 	go func() {
// 		<-signalChannel
// 		endWaiter.Done()
// 	}()
// 	endWaiter.Wait()
// }
