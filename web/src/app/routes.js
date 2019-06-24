import React from "react";
import { Route } from "react-router-dom";

import Library from "./library";
import Artists from "./artists";
import Album from "./album";
import Unassigned from "./unassigned";

export const routes = {

  library: {
    label: "Library",
		icon: "library_music",
		path: "/",
    // render: ({key}) => <Library key={key} />,
		router: () => <Route key="Library" exact path="/" component={Library} />
  },
  artists: {
    label: "Artists",
    icon: "people",
		path: "/artists",
    // render: ({key}) => <Artists key={key} />,
		router: () => <Route key="Artists" path="/artists" component={Artists} />,
    menu: true
  },
  album: {
    label: "Album",
    icon: "album",
    // render: ({ key, artist, album }) => <Album key={key} artistName={artist} albumName={album} />
		router: () => <Route key="Album" path="/album" component={Album} />
  },
  // albums: {
  //   label: "Albums",
  //   icon: "album",
	// 	path: "/",
  //   // render: ({key}) => <Artists key={key} />,
  //   menu: true
  // },
  unassigned: {
    label: "Unassigned",
    icon: "error_outline",
		path: "/unassigned",
    // render: ({key}) => <Unassigned key={key}/>,
		router: () => <Route key="Unassigned" path="/unassigned" component={Unassigned} />,
    menu: true
  }
};

export default routes;
