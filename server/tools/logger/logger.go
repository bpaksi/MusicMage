package logger

import (
	"log"
	"path"

	"os/user"

	"gopkg.in/natefinch/lumberjack.v2"
)

// Init ...
func Init() {
	fileName := getFileName()

	logFileWriter := lumberjack.Logger{
		Filename:   fileName,
		MaxSize:    500, // megabytes
		MaxBackups: 3,
		MaxAge:     28,   //days
		Compress:   true, // disabled by default
	}
	// logFileWriter.Rotate()

	log.SetOutput(&logFileWriter)

	log.Printf("logger.Init: %s\n", fileName)
}

func getFileName() string {
	usr, _ := user.Current()
	return path.Join(usr.HomeDir, "Library", "Logs", "MusicMage", "log.txt")
}
