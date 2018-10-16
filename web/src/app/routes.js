import React from "react";
import Library from "./library";
import Artists from "./artists";
import Album from "./album";
import Unassigned from "./unassigned";

export const routes = {
  library: {
    label: "Library",
    icon: "library_music",
    render: () => <Library />
  },
  artists: {
    label: "Artists",
    icon: "people",
    render: () => <Artists />,
    menu: true
  },
  album: {
    label: "Album",
    icon: "album",
    render: ({ artist, album }) => <Album artistName={artist} albumName={album} />
  },
  albums: {
    label: "Albums",
    icon: "album",
    render: () => <Artists />,
    menu: true
  },
  unassigned: {
    label: "Unassigned",
    icon: "error_outline",
    render: () => <Unassigned />,
    menu: true
  }
};

export default routes;
