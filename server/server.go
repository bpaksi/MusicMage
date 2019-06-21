package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"

	"github.com/bpaksi/MusicMage/server/tools/logger"

	"github.com/bpaksi/MusicMage/server/api"
	"github.com/bpaksi/MusicMage/server/services/database"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("ERROR: %v", r)
		}
	}()

	logger.Init()

	database.StartDatabase()
	api.StartAPI()
	startStaticFileServer()

	var stop = make(chan os.Signal)
	startGracefulShutdown(stop)

	// http.ListenAndServe("localhost:4001", nil)
	httpServer := startHTTPServer()
	<-stop

	database.Shutdown()
	api.Shutdown()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	httpServer.Shutdown(ctx)

	log.Printf("go functions: (%d)", runtime.NumGoroutine())
	log.Printf("Music Mage Stopped")
}

func startStaticFileServer() {
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./static"))))
}

func startGracefulShutdown(stop chan os.Signal) {
	signal.Notify(stop, syscall.SIGTERM)
	signal.Notify(stop, syscall.SIGINT)
}

func startHTTPServer() *http.Server {

	addr := ":" + os.Getenv("PORT")
	if addr == ":" {
		addr = ":4001"
	}

	h := &http.Server{Addr: addr}
	if err := h.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
	return h
}
