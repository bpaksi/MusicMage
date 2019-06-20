package artists

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/bpaksi/MusicMage/server/services/database/songs"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

type Genres struct {
	lock    sync.RWMutex
	records []string
}

func init() {
	genres := &Genres{
		records: make([]string, 0),
	}

	messagebus.Subscribe("SONG_ADDED", genres.onAddSong)
	messagebus.Subscribe("SONG_DELETED", genres.onDeleteSong)
	messagebus.Subscribe("SONG_CHANGED", genres.onChangeSong)
}

func (genres *Genres) onFetchAll(clientID int64) {
	genres.lock.RLock()
	defer genres.lock.RUnlock()

	raw, err := json.Marshal(genres.records)
	if err != nil {
		log.Println("Error: " + err.Error())
		return
	}

	messagebus.PublishVerbose(messagebus.Message{
		Type:     "GENRES_FETCHED",
		Payload:  raw,
		ClientID: clientID,
	})
}

func (genres *Genres) onAddSong(song songs.Song) {
	genres.lock.Lock()
	defer genres.lock.Unlock()

	genre := song.Genre()

	found := false
	for _, i := range genres.records {
		if i == genre {
			found = true
			break
		}
	}

	if !found {
		genres.records = append(genres.records, genre)
	}
}

func (genres *Genres) onDeleteSong(song songs.Song) {
	genres.lock.Lock()
	defer genres.lock.Unlock()

	genre := song.Genre()

	for idx, i := range genres.records {
		if i == genre {
			genres.records = append(genres.records[:idx], genres.records[idx+1:]...)
			break
		}
	}
}

func (genres *Genres) onChangeSong(changed songs.SongChanged) {
	if changed.Old.Genre() != changed.New.Genre() {
		genres.onAddSong(changed.New)
		genres.onDeleteSong(changed.Old)
	}
}
