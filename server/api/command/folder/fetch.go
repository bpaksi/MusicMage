package folder

import (
	"path"

	"github.com/bpaksi/MusicMage/server/api/connection"
)

// File ...
type File struct {
	ID       int64  `json:"id"`
	Artist   string `json:"artist"`
	Album    string `json:"album"`
	Title    string `json:"title"`
	Filename string `json:"filename"`
}

// FetchFolder ...
func FetchFolder(client *connection.Client, message connection.Message) {
	relativePath := message.Payload.(string)
	files := make([]File, 0)

	searchPath := path.Join(client.Services.Database.RootFolder, relativePath)
	// log.Println("Path: " + path)

	for _, song := range client.Services.Database.Songs.Records {
		dir := path.Dir(song.File.FullPath)

		if dir == searchPath {
			_, filename := path.Split(song.File.FullPath)

			rec := File{
				ID:       song.ID,
				Artist:   song.File.Artist(),
				Album:    song.File.Album(),
				Title:    song.File.Title(),
				Filename: filename,
			}

			files = append(files, rec)
		}
	}
	client.Send("FOLDER_FETCHED", files)
}
