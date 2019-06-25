package artists

import (
	"sync"

	"github.com/bpaksi/MusicMage/server/services/database/songs"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

type GenreList struct {
	lock    sync.RWMutex
	records []string
}

func init() {
	genres := &GenreList{
		records: make([]string, 0),
	}

	messagebus.Subscribe("GENRES_FETCH", genres.onAll)

	messagebus.Subscribe("SONG_ADDED", genres.onAddSong)
	messagebus.Subscribe("SONG_DELETED", genres.onDeleteSong)
	messagebus.Subscribe("SONG_CHANGED", genres.onChangeSong)
}

func (genres *GenreList) onAll() {
	genres.lock.RLock()
	defer genres.lock.RUnlock()

	messagebus.Publish("GENRES_UPDATED", genres.records)
}

func (genres *GenreList) onAddSong(song songs.Song) {
	genres.lock.Lock()
	defer genres.lock.Unlock()

	genre := song.Genre

	found := false
	for _, i := range genres.records {
		if i == genre {
			found = true
			break
		}
	}

	if !found {
		genres.records = append(genres.records, genre)

		messagebus.Publish("GENRES_UPDATED", genres.records)
	}
}

func (genres *GenreList) onDeleteSong(song songs.Song) {
	genres.lock.Lock()
	defer genres.lock.Unlock()

	genre := song.Genre

	for idx, i := range genres.records {
		if i == genre {
			genres.records = append(genres.records[:idx], genres.records[idx+1:]...)

			messagebus.Publish("GENRES_UPDATED", genres.records)
			return
		}
	}
}

func (genres *GenreList) onChangeSong(changed songs.SongChanged) {
	if changed.Old.Genre != changed.New.Genre {
		genres.onAddSong(changed.New)
		genres.onDeleteSong(changed.Old)
	}
}
