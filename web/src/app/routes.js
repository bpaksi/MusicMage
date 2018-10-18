import React from "react";
import Library from "./library";
import Artists from "./artists";
import Album from "./album";
import Unassigned from "./unassigned";

export const routes = {
  library: {
    label: "Library",
    icon: "library_music",
    render: ({key}) => <Library key={key} />
  },
  artists: {
    label: "Artists",
    icon: "people",
    render: ({key}) => <Artists key={key} />,
    menu: true
  },
  album: {
    label: "Album",
    icon: "album",
    render: ({ key, artist, album }) => <Album key={key} artistName={artist} albumName={album} />
  },
  albums: {
    label: "Albums",
    icon: "album",
    render: ({key}) => <Artists key={key} />,
    menu: true
  },
  unassigned: {
    label: "Unassigned",
    icon: "error_outline",
    render: ({key}) => <Unassigned key={key}/>,
    menu: true
  }
};

export default routes;
