package folder

import (
	"path"
	"strings"

	"github.com/bpaksi/MusicMage/server/api/connection"
)

// Node ...
type Node struct {
	Name     string `json:"name"`
	Children []Node `json:"children,omitempty"`
}

func init() {
	connection.Router.Handle("FOLDERS_FETCH", all)
}

func all(client *connection.Client) {
	folders := make([]string, 0)
	root := client.Services.Database.RootFolder + "/"

	for _, song := range client.Services.Database.Songs.Records {
		dir, _ := path.Split(song.File.FullPath)
		if strings.HasPrefix(dir, root) {
			folder := strings.TrimPrefix(dir, root)
			folder = strings.TrimSuffix(folder, "/")

			if !contains(folders, folder) {
				folders = append(folders, folder)
			}
		}
	}

	// log.Printf("folders: %#v", folders)

	var tree []Node
	for i := range folders {
		tree = addToTree(tree, strings.Split(folders[i], "/"))
	}

	client.Send("FOLDERS_FETCHED", tree)
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func addToTree(root []Node, names []string) []Node {
	if len(names) > 0 {
		var i int
		for i = 0; i < len(root); i++ {
			if root[i].Name == names[0] { //already in tree
				break
			}
		}
		if i == len(root) {
			root = append(root, Node{Name: names[0]})
		}
		root[i].Children = addToTree(root[i].Children, names[1:])
	}
	return root
}
