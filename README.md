# MusicMage
Website to manage and organize music files located on disk. Files are maintained in the following layout Artist / Album / Song


#Getting started
##Music Repository (currently hard coded)
		Add music collection to Users home dir in subfolder "/music/my music test"

		i.e. "/Users/bobpaksi/music/my music test"
		
			Folder layout
				Artist / Album / Song
				i.e. Paramore / Riot! / Paramore  - Hallelujah.mp3

###Server
	CD ./musicmage/server
	GO RUN server.go

###Web
	CD ./musicmage/web
	NPM START
