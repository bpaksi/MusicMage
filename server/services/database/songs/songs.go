package songs

import (
	"sync"

	"github.com/bpaksi/MusicMage/server/services/database/files"
	"github.com/bpaksi/MusicMage/server/tools"
)

// ChangeHandler ...
type ChangeHandler func(old, current *Song)

type registeredChangeHander struct {
	Key           int64
	ChangeHandler ChangeHandler
}

// Songs ...
type Songs struct {
	sync.RWMutex
	Records []*Song

	identiy *tools.IdentityGenerator

	changeHandlerKeyGenerator *tools.IdentityGenerator
	changeHandlers            []registeredChangeHander
}

// NewSongIndex ...
func NewSongIndex(files *files.Files) *Songs {
	songs := &Songs{}
	songs.Records = make([]*Song, 0)
	songs.identiy = tools.NewIdentityGenerator()
	songs.changeHandlerKeyGenerator = tools.NewIdentityGenerator()
	songs.changeHandlers = make([]registeredChangeHander, 0)

	files.OnAdd(songs.onAddSongHandler)
	files.OnDelete(songs.onDeleteSongHandler)
	files.OnChange(songs.onChangeSongHandler)
	return songs
}

// AddChangeHandler ...
func (songs *Songs) AddChangeHandler(handler ChangeHandler) (key int64) {
	key = songs.changeHandlerKeyGenerator.Next()

	h := registeredChangeHander{
		Key:           key,
		ChangeHandler: handler,
	}

	songs.changeHandlers = append(songs.changeHandlers, h)
	return
}

// RemoveChangeHandler ...
func (songs *Songs) RemoveChangeHandler(key int64) bool {
	for i, hndlr := range songs.changeHandlers {
		if hndlr.Key == key {
			songs.changeHandlers = append(songs.changeHandlers[:i], songs.changeHandlers[i+1:]...)
			return true
		}
	}

	return false
}

func (songs *Songs) onAddSongHandler(file *files.MusicFile) {
	songs.Lock()
	defer songs.Unlock()

	added := &Song{
		ID:   songs.identiy.Next(),
		File: file,
	}

	songs.Records = append(songs.Records, added)

	for _, onChange := range songs.changeHandlers {
		onChange.ChangeHandler(&Song{}, added)
	}
}

func (songs *Songs) onDeleteSongHandler(file *files.MusicFile) {
	songs.Lock()
	defer songs.Unlock()

	if idx, ok := songs.find(file.FullPath); ok {
		old := songs.Records[idx]

		songs.Records = append(songs.Records[:idx], songs.Records[idx+1:]...)

		for _, onChange := range songs.changeHandlers {
			onChange.ChangeHandler(old, &Song{})
		}
	}
}

func (songs *Songs) onChangeSongHandler(old, new *files.MusicFile) {
	if idx, ok := songs.find(old.FullPath); ok {
		old := songs.Records[idx]
		added := &Song{
			ID:   old.ID,
			File: new,
		}

		songs.Records[idx] = added

		for _, onChange := range songs.changeHandlers {
			onChange.ChangeHandler(old, added)
		}
	}
}

func (songs *Songs) find(fullPath string) (idx int, ok bool) {
	ok = false
	for idx = range songs.Records {
		if songs.Records[idx].File.FullPath == fullPath {
			ok = true
			break
		}
	}

	return
}
