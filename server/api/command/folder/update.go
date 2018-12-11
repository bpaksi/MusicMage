package folder

import (
	"fmt"

	"github.com/bpaksi/MusicMage/server/api/connection"
)

type params struct {
	ID     int    `json:"id"`
	Artist string `json:"artist"`
	Album  string `json:"album"`
	Title  string `json:"title"`
}

func init() {
	connection.Router.Handle("FOLDER_UPDATE", Update)
}

// Update ...
func Update(client *connection.Client, params params) {
	fmt.Printf("folder - update: %+v", params)
	fmt.Println()
}
