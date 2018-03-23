package watcher

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

	stop       chan bool
	rootFolder string

	onFileAddedHandlers     []FileAddedHandler
	onFileDeletedHandlers   []FileDeletedHandler
	onFileChangedHandlers   []FileChangedHandler
	onFolderDeletedHandlers []FolderDeletedHandler
}

// NewWatcher ...
func NewWatcher() *Watcher {
	return &Watcher{
		isWatching:              false,
		stop:                    make(chan bool),
		onFileAddedHandlers:     make([]FileAddedHandler, 0),
		onFileDeletedHandlers:   make([]FileDeletedHandler, 0),
		onFileChangedHandlers:   make([]FileChangedHandler, 0),
		onFolderDeletedHandlers: make([]FolderDeletedHandler, 0),
	}
}

// Start ...
func (watcher *Watcher) Start(rootFolder string) (err error) {
	if watcher.isWatching {
		err = fmt.Errorf("Can not start when already running")
		return
	}

	watcher.isWatching = true
	watcher.rootFolder = rootFolder
	watcher.watcher, err = fsnotify.NewWatcher()
	if err != nil {
		return
	}

	watcher.initWatcher(rootFolder)
	go watcher.watch()
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

// OnFileAdded ...
func (watcher *Watcher) OnFileAdded(handler FileAddedHandler) {
	watcher.onFileAddedHandlers = append(watcher.onFileAddedHandlers, handler)
}

// OnFileChanged ...
func (watcher *Watcher) OnFileChanged(handler FileChangedHandler) {
	watcher.onFileChangedHandlers = append(watcher.onFileChangedHandlers, handler)
}

// OnFileDeleted ...
func (watcher *Watcher) OnFileDeleted(handler FileDeletedHandler) {
	watcher.onFileDeletedHandlers = append(watcher.onFileDeletedHandlers, handler)
}

// OnFolderDeleted ...
func (watcher *Watcher) OnFolderDeleted(handler FolderDeletedHandler) {
	watcher.onFolderDeletedHandlers = append(watcher.onFolderDeletedHandlers, handler)
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
			if inErr != nil {

				log.Println("init error: " + inErr.Error())
				return
			}

			if info.IsDir() {
				watcher.watcher.Add(path)
			} else {
				for _, onFileAdded := range watcher.onFileAddedHandlers {
					onFileAdded(path)
				}
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
			log.Println("Folder Added (" + event.Name + ")")

			watcher.watcher.Add(event.Name)
		}

		if isDeleted {
			log.Println("File Deleted (" + event.Name + ")")

			watcher.watcher.Remove(event.Name)
			for _, onFolderDeleted := range watcher.onFolderDeletedHandlers {
				onFolderDeleted(event.Name)
			}
		}

	} else { // Is a file
		switch {
		case isAdded:
			{
				rel, _ := filepath.Rel(watcher.rootFolder, event.Name)
				log.Println("File Added (" + rel + ")")

				for _, onFileAdded := range watcher.onFileAddedHandlers {
					onFileAdded(event.Name)
				}
			}

		case isDeleted:
			{
				rel, _ := filepath.Rel(watcher.rootFolder, event.Name)
				log.Println("File Deleted (" + rel + ")")

				for _, onFileDeleted := range watcher.onFileDeletedHandlers {
					onFileDeleted(event.Name)
				}
			}

		default:
			{
				rel, _ := filepath.Rel(watcher.rootFolder, event.Name)
				log.Println("File Changed (" + rel + ")")

				for _, onFileChanged := range watcher.onFileChangedHandlers {
					onFileChanged(event.Name)
				}
			}
		}
	}
}
