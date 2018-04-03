package folder

import (
	"path"

	"github.com/bpaksi/MusicMage/server/api/connection"
)

type result struct {
	ID       int64  `json:"id"`
	Artist   string `json:"artist"`
	Album    string `json:"album"`
	Title    string `json:"title"`
	Filename string `json:"filename"`
}

func init() {
	connection.Router.Handle("FOLDER_FETCH", folder)
}

func folder(client *connection.Client, relativePath string) {
	searchPath := path.Join(client.Services.Database.RootFolder, relativePath)

	results := make([]result, 0)
	for _, song := range client.Services.Database.Songs.Records {
		dir := path.Dir(song.File.FullPath)

		if dir == searchPath {
			_, filename := path.Split(song.File.FullPath)

			results = append(results, result{
				ID:       song.ID,
				Artist:   song.File.Artist(),
				Album:    song.File.Album(),
				Title:    song.File.Title(),
				Filename: filename,
			})
		}
	}

	client.Send("FOLDER_FETCHED", results)
}
