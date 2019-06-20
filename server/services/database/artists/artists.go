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

// ArtistList ...
type ArtistList struct {
	lock    sync.RWMutex
	records []Artist

	identiy *tools.IdentityGenerator
}

var Artists *ArtistList

func init() {
	Artists := &ArtistList{
		records: make([]Artist, 0),
		identiy: tools.NewIdentityGenerator(),
	}

	messagebus.Subscribe("SONG_ADDED", Artists.onAddSong)
	messagebus.Subscribe("SONG_DELETED", Artists.onDeleteSong)
	messagebus.Subscribe("SONG_CHANGED", Artists.onChangeSong)
}

func (artists *ArtistList) All() []Artist {
	artists.lock.RLock()
	defer artists.lock.RUnlock()

	return artists.records

}

func (artists *ArtistList) onAddSong(song songs.Song) {
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

func (artists *ArtistList) onDeleteSong(song songs.Song) {
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

func (artists *ArtistList) onChangeSong(changed songs.SongChanged) {
	if changed.Old.Artist != changed.New.Artist || changed.Old.Album != changed.New.Album {
		artists.onAddSong(changed.New)
		artists.onDeleteSong(changed.Old)
	}
}

func (artists *ArtistList) find(artist, album string) (idx int, ok bool) {
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
