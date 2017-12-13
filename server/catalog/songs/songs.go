package songs

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/bpaksi/MusicMage/server/tools"
)

// AddHandler ...
type AddHandler func(Song)

// ChangeHandler ...
type ChangeHandler func(old, new Song)

// DeleteHandler ...
type DeleteHandler func(Song)

// CloseHandler ...
type CloseHandler func()

// Songs ...
type Songs struct {
	sync.RWMutex

	root     string
	Records  []Song
	BadFiles []BadMusicRecord

	identiy *tools.IdentityGenerator
	watcher *Watcher

	onAddHandlers    []AddHandler
	onDeleteHandlers []DeleteHandler
	onChangeHandlers []ChangeHandler
	onCloseHandlers  []CloseHandler
}

// NewSongDatabase ...
func NewSongDatabase() *Songs {
	database := &Songs{}

	database.onAddHandlers = make([]AddHandler, 0)
	database.onDeleteHandlers = make([]DeleteHandler, 0)
	database.onChangeHandlers = make([]ChangeHandler, 0)
	database.onCloseHandlers = make([]CloseHandler, 0)

	database.Records = make([]Song, 0)
	database.BadFiles = make([]BadMusicRecord, 0)

	database.watcher = NewWatcher()
	database.watcher.OnFileAdded = database.onFileAdded
	database.watcher.OnFileDeleted = database.onFileDeleted
	database.watcher.OnFileChanged = database.onFileChanged
	database.watcher.OnFolderDeleted = database.onFolderDeleted

	database.identiy = tools.NewIdentityGenerator()
	return database
}

// Open ...
func (database *Songs) Open(root string) (err error) {
	database.Lock()
	defer database.Unlock()

	if len(database.root) != 0 {
		err = fmt.Errorf("Database is already open")
		return
	}

	database.root = root

	database.init()
	database.watcher.Start(root)
	return
}

// Close ...
func (database *Songs) Close() {
	database.Lock()
	defer database.Unlock()

	database.watcher.Stop()

	database.Records = make([]Song, 0)
	database.BadFiles = make([]BadMusicRecord, 0)

	database.identiy.Reset()

	for _, onClose := range database.onCloseHandlers {
		onClose()
	}
}

// OnAdd ...
func (database *Songs) OnAdd(handler AddHandler) {
	database.onAddHandlers = append(database.onAddHandlers, handler)
}

// OnDelete ...
func (database *Songs) OnDelete(handler DeleteHandler) {
	database.onDeleteHandlers = append(database.onDeleteHandlers, handler)
}

// OnChange ...
func (database *Songs) OnChange(handler ChangeHandler) {
	database.onChangeHandlers = append(database.onChangeHandlers, handler)
}

// OnClose ...
func (database *Songs) OnClose(handler CloseHandler) {
	database.onCloseHandlers = append(database.onCloseHandlers, handler)
}

func (database *Songs) onFileChanged(fullPath string) {
	database.Lock()
	defer database.Unlock()

	relativePath := fullPath[len(database.root):]

	for idx, old := range database.Records {
		if old.RelativePath == relativePath {
			log.Println("MusicDatabase.onFileChanged found file  (" + relativePath + ")")

			f, ferr := OpenMusicFile(fullPath)
			if ferr != nil {
				log.Panicln("not implemented")
			} else {
				if database.Records[idx].HasChanges(f) {
					database.Records[idx].file = f

					for _, onChange := range database.onChangeHandlers {
						onChange(old, database.Records[idx])
					}
				}
			}

			break
		}
	}

}

func (database *Songs) onFileAdded(fullPath string) {
	database.Lock()
	defer database.Unlock()

	log.Println("File Added (" + fullPath + ")")

	database.fileAddHelper(fullPath)
}

func (database *Songs) onFileDeleted(fullPath string) {
	database.Lock()
	defer database.Unlock()

	log.Println("File Deleted (" + fullPath + ")")

	relativePath := fullPath[len(database.root):]

	for idx, old := range database.Records {
		if old.RelativePath == relativePath {
			database.Records = append(database.Records[:idx], database.Records[idx+1:]...)

			for _, onDelete := range database.onDeleteHandlers {
				onDelete(old)
			}

			break
		}
	}

	for idx, old := range database.BadFiles {
		if old.RelativePath == relativePath {
			database.BadFiles = append(database.BadFiles[idx:], database.BadFiles[:idx+1]...)
			break
		}
	}
}

func (database *Songs) onFolderDeleted(folder string) {
	database.Lock()
	defer database.Unlock()

	log.Println("Folder Deleted (" + folder + ")")

	for i := len(database.Records) - 1; i >= 0; i-- {
		fullPath := filepath.Join(database.root, database.Records[i].RelativePath)
		if strings.HasPrefix(fullPath, folder) {
			old := database.Records[i]

			database.Records = append(database.Records[:i], database.Records[i+1:]...)

			for _, onDelete := range database.onDeleteHandlers {
				onDelete(old)
			}
		}
	}

	for i := len(database.BadFiles) - 1; i >= 0; i-- {
		fullPath := filepath.Join(database.root, database.BadFiles[i].RelativePath)
		if strings.HasPrefix(fullPath, folder) {
			database.BadFiles = append(database.BadFiles[:i], database.BadFiles[i+1:]...)
		}
	}
}

func (database *Songs) init() {
	filepath.Walk(database.root,
		func(path string, info os.FileInfo, inErr error) (err error) {
			if inErr != nil {

				log.Println("init error: " + inErr.Error())
				return
			}

			database.fileAddHelper(path)
			return
		})
}

func (database *Songs) fileAddHelper(fullPath string) {
	ext := strings.ToLower(filepath.Ext(fullPath))
	supportedFile := ext == ".mp3" || ext == ".aiff" || ext == ".wav" || ext == ".mpeg-4" || ext == ".m4a"

	if supportedFile {
		relativePath := fullPath[len(database.root):]

		f, ferr := OpenMusicFile(fullPath)
		if ferr != nil {
			var badFile BadMusicRecord
			badFile.RelativePath = relativePath
			badFile.Err = ferr
			database.BadFiles = append(database.BadFiles, badFile)
		} else {
			var song Song
			song.ID = database.identiy.Next()
			song.RelativePath = relativePath
			song.file = f
			database.Records = append(database.Records, song)

			for _, onAdd := range database.onAddHandlers {
				onAdd(song)
			}
		}
	}
}
