package artists

import (
	"sync"

	"github.com/bpaksi/MusicMage/server/catalog/songs"
	"github.com/bpaksi/MusicMage/server/tools"
)

// ChangeHandler ...
type ChangeHandler func(oldArtist, newArtist Artist)

type registeredChangeHander struct {
	Key           int64
	ChangeHandler ChangeHandler
}

// Artists ...
type Artists struct {
	sync.RWMutex
	Records []Artist

	identiy *tools.IdentityGenerator

	changeHandlerKeyGenerator *tools.IdentityGenerator
	changeHandlers            []registeredChangeHander
}

// NewArtistDatabase ...
func NewArtistDatabase(songs *songs.Songs) *Artists {
	artists := &Artists{}
	artists.Records = make([]Artist, 0)
	artists.identiy = tools.NewIdentityGenerator()
	artists.changeHandlerKeyGenerator = tools.NewIdentityGenerator()
	artists.changeHandlers = make([]registeredChangeHander, 0)

	songs.OnAdd(artists.onAddHandler)
	songs.OnDelete(artists.onDeleteHandler)
	songs.OnChange(artists.onChangeHandler)
	songs.OnClose(artists.onCloseHandler)

	return artists
}

// AddChangeHandler ...
func (artists *Artists) AddChangeHandler(handler ChangeHandler) (key int64) {
	key = artists.changeHandlerKeyGenerator.Next()

	var h registeredChangeHander
	h.Key = key
	h.ChangeHandler = handler

	artists.changeHandlers = append(artists.changeHandlers, h)
	return
}

// RemoveChangeHandler ...
func (artists *Artists) RemoveChangeHandler(key int64) {
	for i, hndlr := range artists.changeHandlers {
		if hndlr.Key == key {
			artists.changeHandlers = append(artists.changeHandlers[:i], artists.changeHandlers[i+1:]...)
		}
	}
}

func (artists *Artists) onAddHandler(song songs.Song) {
	artists.Lock()
	defer artists.Unlock()

	artist := song.Artist()
	album := song.Album()

	if idx, ok := artists.find(artist, album); ok {
		old := artists.Records[idx]

		artists.Records[idx].SongCount++

		for _, onChange := range artists.changeHandlers {
			onChange.ChangeHandler(old, artists.Records[idx])
		}
	} else {
		var a Artist
		a.ID = artists.identiy.Next()
		a.Artist = artist
		a.Album = album
		a.SongCount = 1
		artists.Records = append(artists.Records, a)

		for _, onChange := range artists.changeHandlers {
			onChange.ChangeHandler(Artist{}, artists.Records[len(artists.Records)-1])
		}
	}
}

func (artists *Artists) onDeleteHandler(song songs.Song) {
	artists.Lock()
	defer artists.Unlock()

	artist := song.Artist()
	album := song.Album()

	if idx, ok := artists.find(artist, album); ok {
		oldRec := artists.Records[idx]
		artists.Records[idx].SongCount--

		newRec := artists.Records[idx]
		if artists.Records[idx].SongCount == 0 {
			artists.Records = append(artists.Records[:idx], artists.Records[idx+1:]...)

			newRec = Artist{}
		}

		for _, onChange := range artists.changeHandlers {
			onChange.ChangeHandler(oldRec, newRec)
		}
	}
}

func (artists *Artists) onChangeHandler(old, new songs.Song) {
	artists.onAddHandler(new)
	artists.onDeleteHandler(old)
}

func (artists *Artists) onCloseHandler() {
	artists.Lock()
	defer artists.Unlock()

	artists.Records = make([]Artist, 0)
}

func (artists *Artists) find(artist, album string) (idx int, ok bool) {
	ok = false
	var rec Artist
	for idx, rec = range artists.Records {
		if rec.Artist == artist && rec.Album == album {
			ok = true
			break
		}
	}

	return
}
