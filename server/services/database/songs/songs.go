package songs

import (
	"log"
	"path/filepath"
	"strings"
	"sync"

	"github.com/bpaksi/MusicMage/server/tools"
	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

// SongList ...
type SongList struct {
	lock    sync.RWMutex
	identiy *tools.IdentityGenerator

	rootFolder string
	records    []Song
	badFiles   []*badMusicRecord
}

type badMusicRecord struct {
	FilePath string

	Err error
}

// SongChanged ...
type SongChanged struct {
	Old Song
	New Song
}

var songs *SongList

func init() {
	songs = &SongList{
		records:  make([]Song, 0),
		badFiles: make([]*badMusicRecord, 0),
		identiy:  tools.NewIdentityGenerator(),
	}

	messagebus.Subscribe("DATABASE_STARTUP", songs.onStart)

	messagebus.Subscribe("FILE_ADDED", songs.onFileAdded)
	messagebus.Subscribe("FILE_DELETED", songs.onFileDeleted)
	messagebus.Subscribe("FILE_CHANGED", songs.onFileChanged)

	messagebus.Subscribe("SONGS_FETCH", songs.onSongsFetch)
	messagebus.Subscribe("SONG_UPDATE", songs.onSongUpdate)
}

func (songs *SongList) onStart(rootFolder string) {
	songs.lock.Lock()
	defer songs.lock.Unlock()

	songs.rootFolder = rootFolder
}

func (songs *SongList) onFileChanged(fullPath string) {
	if !isSupported(fullPath) {
		return
	}

	songs.lock.Lock()
	defer songs.lock.Unlock()

	for idx, old := range songs.records {
		if old.fullPath == fullPath {
			song, ferr := OpenMusicFile(fullPath)
			if ferr != nil {
				log.Panicln("not implemented")
				return
			}
			song.ID = old.ID

			songs.records[idx] = song
			messagebus.Publish("SONG_CHANGED", SongChanged{
				Old: old,
				New: songs.records[idx],
			})
			break
		}
	}
}

func (songs *SongList) onFileAdded(fullPath string) {
	if !isSupported(fullPath) {
		return
	}

	songs.lock.Lock()
	defer songs.lock.Unlock()

	song, err := OpenMusicFile(fullPath)
	if err != nil {
		songs.badFiles = append(songs.badFiles, &badMusicRecord{
			FilePath: fullPath,
			Err:      err,
		})
	} else {
		song.ID = songs.identiy.Next()
		dir, fileName := filepath.Split(song.fullPath)

		song.RelPath, _ = filepath.Rel(songs.rootFolder, dir)
		song.FileName = fileName
		songs.records = append(songs.records, song)

		messagebus.Publish("SONG_ADDED", song)
	}
}

func (songs *SongList) onFileDeleted(fullPath string) {
	if !isSupported(fullPath) {
		return
	}

	songs.lock.Lock()
	defer songs.lock.Unlock()

	for idx, old := range songs.records {
		if old.fullPath == fullPath {
			songs.records = append(songs.records[:idx], songs.records[idx+1:]...)

			messagebus.Publish("SONG_DELTED", old)
			break
		}
	}

	for idx, old := range songs.badFiles {
		if old.FilePath == fullPath {
			songs.badFiles = append(songs.badFiles[idx:], songs.badFiles[:idx+1]...)
			break
		}
	}
}

func isSupported(fullPath string) bool {
	ext := strings.ToLower(filepath.Ext(fullPath))
	return ext == ".mp3" || ext == ".aiff" || ext == ".wav" || ext == ".mpeg-4" || ext == ".m4a"
}
