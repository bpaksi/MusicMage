package songs

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
)

// FileAddedHandler ...
type FileAddedHandler func(fullPath string)

// FileDeletedHandler ...
type FileDeletedHandler func(fullPath string)

// FileChangedHandler ...
type FileChangedHandler func(fullPath string)

// FolderDeletedHandler ...
type FolderDeletedHandler func(fullPath string)

// Watcher ...
type Watcher struct {
	watcher    *fsnotify.Watcher
	isWatching bool

	stop        chan bool
	catalogRoot string

	OnFileAdded     FileAddedHandler
	OnFileDeleted   FileDeletedHandler
	OnFileChanged   FileChangedHandler
	OnFolderDeleted FolderDeletedHandler
}

// NewWatcher ...
func NewWatcher() *Watcher {
	return &Watcher{
		isWatching: false,
		stop:       make(chan bool),
	}
}

// Start ...
func (watcher *Watcher) Start(catalogRoot string) (err error) {
	if watcher.isWatching {
		err = fmt.Errorf("Can not start when already running")
		return
	}

	watcher.isWatching = true
	watcher.catalogRoot = catalogRoot
	watcher.watcher, err = fsnotify.NewWatcher()
	if err != nil {
		return
	}

	go watcher.watch()

	watcher.initWatcher(catalogRoot)
	return
}

// IsWatching ...
func (watcher *Watcher) IsWatching() (isWatching bool) {
	isWatching = watcher.isWatching
	return
}

// Stop ...
func (watcher *Watcher) Stop() (err error) {
	if watcher.isWatching {
		watcher.isWatching = false
		watcher.watcher.Close()

		select {
		case <-watcher.stop:
		case <-time.After(10 * time.Second):
			err = fmt.Errorf("Error stoping file watcher")
		}
	}

	return
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
			if !watcher.isWatching {
				watcher.watcher.Close()
				watcher.stop <- true
				return
			}
		}
	}

}

func (watcher *Watcher) initWatcher(root string) {
	filepath.Walk(root,
		func(path string, info os.FileInfo, inErr error) (err error) {
			if inErr == nil && info.IsDir() {
				watcher.watcher.Add(path)
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
			watcher.watcher.Add(event.Name)
		}

		if isDeleted {
			watcher.watcher.Remove(event.Name)
			if watcher.OnFolderDeleted != nil {
				watcher.OnFolderDeleted(event.Name)
			}
		}

	} else { // Is a file
		switch {
		case isAdded:
			if watcher.OnFileAdded != nil {
				watcher.OnFileAdded(event.Name)
			}

		case isDeleted:
			if watcher.OnFileDeleted != nil {
				watcher.OnFileDeleted(event.Name)
			}
		default:
			if watcher.OnFileChanged != nil {
				watcher.OnFileChanged(event.Name)
			}
		}
	}
}
