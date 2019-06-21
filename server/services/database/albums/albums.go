package albums

import (
	"sync"

	"github.com/bpaksi/MusicMage/server/services/database/songs"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"

	"github.com/bpaksi/MusicMage/server/tools"
)

// ArtistChanged ...
type ArtistChanged struct {
	Old Album
	New Album
}

// AlbumList ...
type AlbumList struct {
	lock    sync.RWMutex
	records []Album

	identiy *tools.IdentityGenerator
}

func init() {
	albums := &AlbumList{
		records: make([]Album, 0),
		identiy: tools.NewIdentityGenerator(),
	}

	messagebus.Subscribe("ALBUMS_FETCH", albums.onAll)

	messagebus.Subscribe("SONG_ADDED", albums.onAddSong)
	messagebus.Subscribe("SONG_DELETED", albums.onDeleteSong)
	messagebus.Subscribe("SONG_CHANGED", albums.onChangeSong)
}

func (albums *AlbumList) onAll() {
	albums.lock.RLock()
	defer albums.lock.RUnlock()

	messagebus.Publish("ALBUMS_FETCHED", albums.records)
}

func (albums *AlbumList) onAddSong(song songs.Song) {
	albums.lock.Lock()
	defer albums.lock.Unlock()

	artist := song.Artist
	album := song.Album

	var artistIdx int
	var found bool

	artistIdx, found = albums.find(artist, album)
	if !found {
		added := Album{
			ID:        albums.identiy.Next(),
			Name:      artist,
			AlbumName: album,
			SongCount: 0,
		}

		albums.records = append(albums.records, added)
		artistIdx = len(albums.records) - 1
	}

	old := albums.records[artistIdx]
	albums.records[artistIdx] = Album{
		ID:        old.ID,
		Name:      artist,
		AlbumName: album,
		SongCount: old.SongCount + 1,
	}

	messagebus.Publish("ARITIST_INDEX_CHANGED", ArtistChanged{
		Old: old,
		New: albums.records[artistIdx],
	})
}

func (albums *AlbumList) onDeleteSong(song songs.Song) {
	albums.lock.Lock()
	defer albums.lock.Unlock()

	artist := song.Artist
	album := song.Album

	if artistIdx, ok := albums.find(artist, album); ok {
		old := albums.records[artistIdx]
		newArtist := Album{
			ID:        old.ID,
			Name:      artist,
			AlbumName: album,
			SongCount: old.SongCount - 1,
		}

		if newArtist.SongCount == 0 {
			albums.records = append(albums.records[:artistIdx], albums.records[artistIdx+1:]...)
		} else {
			albums.records[artistIdx] = newArtist
		}

		messagebus.Publish("ARITIST_INDEX_CHANGED", ArtistChanged{
			Old: old,
			New: newArtist,
		})
	}
}

func (albums *AlbumList) onChangeSong(changed songs.SongChanged) {
	if changed.Old.Artist != changed.New.Artist || changed.Old.Album != changed.New.Album {
		albums.onAddSong(changed.New)
		albums.onDeleteSong(changed.Old)
	}
}

func (albums *AlbumList) find(artist, album string) (idx int, ok bool) {
	ok = false
	for idx = range albums.records {
		if albums.records[idx].Name == artist &&
			albums.records[idx].AlbumName == album {
			ok = true
			break
		}
	}

	return
}
