package song

// func init() {
// 	connection.Router.Handle("SONG_DELETE", OnDelete)
// }

// OnDelete ...
// func OnDelete(client *connection.Client, message connection.Message) {
// id := int64(message.Payload.(float64))

// for _, song := range client.Services.Database.Songs.Records {
// 	if song.ID == id {
// 		err := os.Remove(song.File.FullPath)

// 		if err != nil {
// 			client.Error(err.Error())
// 		}

// 		return
// 	}
// }

// client.Send("ERROR", fmt.Sprintf("No song found with id = %d", id))
// }
