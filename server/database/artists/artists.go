package artists

import (
	"sync"

	"github.com/bpaksi/MusicMage/server/database/files"
	"github.com/bpaksi/MusicMage/server/tools"
)

// ChangeHandler ...
type ChangeHandler func(old, current Artist)

type registeredChangeHander struct {
	Key           int64
	ChangeHandler ChangeHandler
}

// Artists ...
type Artists struct {
	sync.RWMutex
	Records []*Artist

	identiy *tools.IdentityGenerator

	changeHandlerKeyGenerator *tools.IdentityGenerator
	changeHandlers            []registeredChangeHander
}

// NewArtistIndex ...
func NewArtistIndex(files *files.Files) *Artists {
	artists := &Artists{}
	artists.Records = make([]*Artist, 0)
	artists.identiy = tools.NewIdentityGenerator()
	artists.changeHandlerKeyGenerator = tools.NewIdentityGenerator()
	artists.changeHandlers = make([]registeredChangeHander, 0)

	files.OnAdd(artists.onAddSongHandler)
	files.OnDelete(artists.onDeleteSongHandler)
	files.OnChange(artists.onChangeSongHandler)
	return artists
}

// AddChangeHandler ...
func (artists *Artists) AddChangeHandler(handler ChangeHandler) (key int64) {
	key = artists.changeHandlerKeyGenerator.Next()

	h := registeredChangeHander{
		Key:           key,
		ChangeHandler: handler,
	}

	artists.changeHandlers = append(artists.changeHandlers, h)
	return
}

// RemoveChangeHandler ...
func (artists *Artists) RemoveChangeHandler(key int64) bool {
	for i, hndlr := range artists.changeHandlers {
		if hndlr.Key == key {
			artists.changeHandlers = append(artists.changeHandlers[:i], artists.changeHandlers[i+1:]...)
			return true
		}
	}

	return false
}

func (artists *Artists) onAddSongHandler(file *files.MusicFile) {
	artists.Lock()
	defer artists.Unlock()

	artist := file.Artist()
	album := file.Album()

	var artistIdx int
	var found bool

	artistIdx, found = artists.find(artist, album)
	if !found {
		added := &Artist{
			ID:        artists.identiy.Next(),
			Name:      artist,
			AlbumName: album,
			SongCount: 0,
		}

		artists.Records = append(artists.Records, added)
		artistIdx = len(artists.Records) - 1
	}

	old := artists.Records[artistIdx]
	artists.Records[artistIdx] = &Artist{
		ID:        old.ID,
		Name:      artist,
		AlbumName: album,
		SongCount: old.SongCount + 1,
	}

	for _, onChange := range artists.changeHandlers {
		onChange.ChangeHandler(*old, *artists.Records[artistIdx])
	}
}

func (artists *Artists) onDeleteSongHandler(file *files.MusicFile) {
	artists.Lock()
	defer artists.Unlock()

	artist := file.Artist()
	album := file.Album()

	if artistIdx, ok := artists.find(artist, album); ok {
		old := artists.Records[artistIdx]
		newArtist := &Artist{
			ID:        old.ID,
			Name:      artist,
			AlbumName: album,
			SongCount: old.SongCount - 1,
		}

		if newArtist.SongCount == 0 {
			artists.Records = append(artists.Records[:artistIdx], artists.Records[artistIdx+1:]...)

			newArtist = &Artist{}
		} else {
			artists.Records[artistIdx] = newArtist
		}

		for _, onChange := range artists.changeHandlers {
			onChange.ChangeHandler(*old, *newArtist)
		}
	}
}

func (artists *Artists) onChangeSongHandler(old, new *files.MusicFile) {
	if old.Artist() != new.Artist() || old.Album() != new.Album() {
		artists.onAddSongHandler(new)
		artists.onDeleteSongHandler(old)
	}
}

func (artists *Artists) find(artist, album string) (idx int, ok bool) {
	ok = false
	for idx = range artists.Records {
		if artists.Records[idx].Name == artist &&
			artists.Records[idx].AlbumName == album {
			ok = true
			break
		}
	}

	return
}
