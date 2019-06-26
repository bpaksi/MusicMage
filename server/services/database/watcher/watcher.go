package watcher

import (
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/bpaksi/MusicMage/server/tools/messagebus"

	"github.com/fsnotify/fsnotify"
)

// Watcher ...
type Watcher struct {
	watcher    *fsnotify.Watcher
	isWatching bool

	stop       chan bool
	rootFolder string
}

func init() {
	watcher := Watcher{
		isWatching: false,
		stop:       make(chan bool),
	}

	messagebus.Subscribe("DATABASE_STARTUP", watcher.onStart)
	messagebus.Subscribe("DATABASE_SHUTDOWN", watcher.onStop)
}

func (watcher *Watcher) onStart(rootFolder string) {
	if watcher.isWatching {
		log.Println("Can not start when already running")
		return
	}

	var err error

	watcher.isWatching = true
	watcher.rootFolder = rootFolder
	watcher.watcher, err = fsnotify.NewWatcher()
	if err != nil {
		log.Println(err.Error())
		return
	}

	watcher.initWatcher(rootFolder)
	go watcher.watch()
}

func (watcher *Watcher) onStop() {
	if watcher.isWatching {
		watcher.isWatching = false
		watcher.watcher.Close()

		select {
		case <-watcher.stop:
		case <-time.After(10 * time.Second):
			log.Println("Error stoping file watcher")
		}
	}
}

func (watcher *Watcher) watch() {
	for {
		select {

		case event := <-watcher.watcher.Events:
			if len(event.Name) == 0 {
				continue
			}
			if event.Op&fsnotify.Chmod == fsnotify.Chmod {
				continue
			}
			// log.Println("event: ", event)

			watcher.processFileChanged(event)

		case err := <-watcher.watcher.Errors:
			if err != nil {
				log.Printf("error: %#v", err)
			}
		case <-time.After(10 * time.Second):
			break
		}

		if !watcher.isWatching {
			watcher.stop <- true
			return
		}

	}
}

func (watcher *Watcher) initWatcher(root string) {
	filepath.Walk(root,
		func(path string, info os.FileInfo, inErr error) (err error) {
			if inErr != nil {

				log.Println("init error: " + inErr.Error())
				return
			}

			if info.IsDir() {
				watcher.watcher.Add(path)
			} else {
				messagebus.Publish("FILE_ADDED", path)
			}

			return
		})
}

func (watcher *Watcher) processFileChanged(event fsnotify.Event) {
	isAdded := false
	isDeleted := false
	isDir := false

	fi, err := os.Stat(event.Name)
	if err != nil {
		if strings.HasSuffix(err.Error(), "no such file or directory") {
			isDeleted = true

			if len(filepath.Ext(event.Name)) == 0 {
				isDir = true
			}
		}
	} else {
		if fi.Mode().IsDir() {
			isDir = true
			isAdded = true
		} else {
			isAdded = event.Op&fsnotify.Create == fsnotify.Create
		}
	}

	if isDir { // Is a folder
		if isAdded {
			// log.Println("Folder Added (" + event.Name + ")")

			watcher.watcher.Add(event.Name)
		}

		if isDeleted {
			// log.Println("File Deleted (" + event.Name + ")")

			watcher.watcher.Remove(event.Name)
			messagebus.Publish("FOLDER_DELETED", event.Name)
		}

	} else { // Is a file
		switch {
		case isAdded:
			{
				// rel, _ := filepath.Rel(watcher.rootFolder, event.Name)
				// log.Println("File Added (" + rel + ")")

				messagebus.Publish("FILE_ADDED", event.Name)
			}

		case isDeleted:
			{
				// rel, _ := filepath.Rel(watcher.rootFolder, event.Name)
				// log.Println("File Deleted (" + rel + ")")

				messagebus.Publish("FILE_DELETED", event.Name)
			}

		default:
			{
				// rel, _ := filepath.Rel(watcher.rootFolder, event.Name)
				// log.Println("File Changed (" + rel + ")")

				messagebus.Publish("FILE_CHANGED", event.Name)
			}
		}
	}
}
