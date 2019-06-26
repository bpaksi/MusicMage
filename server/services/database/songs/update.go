package songs

import (
	"log"
)

func (songs *SongList) onSongUpdate(param Song) {
	songs.lock.RLock()
	defer songs.lock.RUnlock()

	for _, song := range songs.records {
		if song.ID == param.ID {

			_, err := song.SaveChanges(param)
			if err != nil {
				log.Panicf("Error occured while saving changes: %s", err.Error())
				return
			}
		}
	}

}
