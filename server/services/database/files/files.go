package files

import (
	"log"
	"path/filepath"
	"strings"
	"sync"

	"github.com/bpaksi/MusicMage/server/services/database/watcher"
)

// AddHandler ...
type AddHandler func(new *MusicFile)

// ChangeHandler ...
type ChangeHandler func(old, new *MusicFile)

// DeleteHandler ...
type DeleteHandler func(old *MusicFile)

// Files ...
type Files struct {
	sync.RWMutex

	Records  []*MusicFile
	BadFiles []BadMusicRecord

	onAddHandlers    []AddHandler
	onDeleteHandlers []DeleteHandler
	onChangeHandlers []ChangeHandler
}

// NewFileDatabase ...
func NewFileDatabase(watcher *watcher.Watcher) *Files {
	files := &Files{}

	files.onAddHandlers = make([]AddHandler, 0)
	files.onDeleteHandlers = make([]DeleteHandler, 0)
	files.onChangeHandlers = make([]ChangeHandler, 0)

	files.Records = make([]*MusicFile, 0)
	files.BadFiles = make([]BadMusicRecord, 0)

	watcher.OnFileAdded(files.onFileAdded)
	watcher.OnFileDeleted(files.onFileDeleted)
	watcher.OnFileChanged(files.onFileChanged)

	return files
}

// OnAdd ...
func (files *Files) OnAdd(handler AddHandler) {
	files.onAddHandlers = append(files.onAddHandlers, handler)
}

// OnDelete ...
func (files *Files) OnDelete(handler DeleteHandler) {
	files.onDeleteHandlers = append(files.onDeleteHandlers, handler)
}

// OnChange ...
func (files *Files) OnChange(handler ChangeHandler) {
	files.onChangeHandlers = append(files.onChangeHandlers, handler)
}

func (files *Files) onFileChanged(fullPath string) {
	files.Lock()
	defer files.Unlock()

	for idx, old := range files.Records {
		if old.FullPath == fullPath {
			f, ferr := OpenMusicFile(fullPath)
			if ferr != nil {
				log.Panicln("not implemented")
				return
			}

			files.Records[idx] = f

			for _, onChange := range files.onChangeHandlers {
				onChange(old, files.Records[idx])
			}
			break
		}
	}
}

func (files *Files) onFileAdded(fullPath string) {
	files.Lock()
	defer files.Unlock()

	ext := strings.ToLower(filepath.Ext(fullPath))
	supportedFile := ext == ".mp3" || ext == ".aiff" || ext == ".wav" || ext == ".mpeg-4" || ext == ".m4a"

	if supportedFile {
		f, err := OpenMusicFile(fullPath)
		if err != nil {
			badFile := BadMusicRecord{
				FilePath: fullPath,
				Err:      err,
			}

			files.BadFiles = append(files.BadFiles, badFile)
		} else {
			files.Records = append(files.Records, f)

			for _, onAdd := range files.onAddHandlers {
				onAdd(f)
			}
		}
	}
}

func (files *Files) onFileDeleted(fullPath string) {
	files.Lock()
	defer files.Unlock()

	for idx, old := range files.Records {
		if old.FullPath == fullPath {
			files.Records = append(files.Records[:idx], files.Records[idx+1:]...)

			for _, onDelete := range files.onDeleteHandlers {
				onDelete(old)
			}

			break
		}
	}

	for idx, old := range files.BadFiles {
		if old.FilePath == fullPath {
			files.BadFiles = append(files.BadFiles[idx:], files.BadFiles[:idx+1]...)
			break
		}
	}
}
