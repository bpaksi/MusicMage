package songs

import (
	"log"

	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

// FetchParam ...
type FetchParam struct {
	Artist string `json:"artist"`
	Album  string `json:"album"`
}

// FetchResult ...
type FetchResult struct {
	Artist string `json:"artist"`
	Album  string `json:"album"`
	Songs  []Song `json:"songs"`
}

func (songs *SongList) onSongsFetch(param FetchParam) {
	songs.lock.RLock()
	defer songs.lock.RUnlock()

	log.Printf("songs.onSongsFetch: %s/%s", param.Artist, param.Album)

	result := FetchResult{
		Artist: param.Artist,
		Album:  param.Album,
		Songs:  make([]Song, 0),
	}

	for _, song := range songs.records {
		if song.Artist == param.Artist && song.Album == param.Album {
			result.Songs = append(result.Songs, song)
		}
	}

	messagebus.Publish("SONGS_FETCHED", result)
}
