package artists

import (
	"sync"

	"github.com/bpaksi/MusicMage/server/services/database/songs"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"

	"github.com/bpaksi/MusicMage/server/tools"
)

// ArtistChanged ...
type ArtistChanged struct {
	Old Artist
	New Artist
}

// Artists ...
type Artists struct {
	lock    sync.RWMutex
	records []Artist

	identiy *tools.IdentityGenerator
}

func init() {
	artists := &Artists{
		records: make([]Artist, 0),
		identiy: tools.NewIdentityGenerator(),
	}

	messagebus.Subscribe("SONG_ADDED", artists.onAddSong)
	messagebus.Subscribe("SONG_DELETED", artists.onDeleteSong)
	messagebus.Subscribe("SONG_CHANGED", artists.onChangeSong)
}


func (artists *Artists) onAddSong(song songs.Song) {
	artists.lock.Lock()
	defer artists.lock.Unlock()

	artist := song.Artist
	album := song.Album

	var artistIdx int
	var found bool

	artistIdx, found = artists.find(artist, album)
	if !found {
		added := Artist{
			ID:        artists.identiy.Next(),
			Name:      artist,
			AlbumName: album,
			SongCount: 0,
		}

		artists.records = append(artists.records, added)
		artistIdx = len(artists.records) - 1
	}

	old := artists.records[artistIdx]
	artists.records[artistIdx] = Artist{
		ID:        old.ID,
		Name:      artist,
		AlbumName: album,
		SongCount: old.SongCount + 1,
	}

	messagebus.Publish("ARITIST_INDEX_CHANGED", ArtistChanged{
		Old: old,
		New: artists.records[artistIdx],
	})
}

func (artists *Artists) onDeleteSong(song songs.Song) {
	artists.lock.Lock()
	defer artists.lock.Unlock()

	artist := song.Artist
	album := song.Album

	if artistIdx, ok := artists.find(artist, album); ok {
		old := artists.records[artistIdx]
		newArtist := Artist{
			ID:        old.ID,
			Name:      artist,
			AlbumName: album,
			SongCount: old.SongCount - 1,
		}

		if newArtist.SongCount == 0 {
			artists.records = append(artists.records[:artistIdx], artists.records[artistIdx+1:]...)
		} else {
			artists.records[artistIdx] = newArtist
		}

		messagebus.Publish("ARITIST_INDEX_CHANGED", ArtistChanged{
			Old: old,
			New: newArtist,
		})
	}
}

func (artists *Artists) onChangeSong(changed songs.SongChanged) {
	if changed.Old.Artist != changed.New.Artist || changed.Old.Album != changed.New.Album {
		artists.onAddSong(changed.New)
		artists.onDeleteSong(changed.Old)
	}
}

func (artists *Artists) find(artist, album string) (idx int, ok bool) {
	ok = false
	for idx = range artists.records {
		if artists.records[idx].Name == artist &&
			artists.records[idx].AlbumName == album {
			ok = true
			break
		}
	}

	return
}
