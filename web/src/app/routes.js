import Library from "./library";
import Artists from "./artists";
import Album from "./album";
import Unassigned from "./unassigned";
import Settings from "./settings";

export const routes = {
  library: {
    label: "Library",
    icon: "library_music",
    path: "/",
    isExact: true,
    component: Library,
    nav: () => ({
      path: routes.library.path,
      name: routes.library.label,
      icon: routes.library.icon
    })
  },
  artists: {
    label: "Artists",
    icon: "people",
    path: "/artists",
    component: Artists,
    nav: () => ({
      path: routes.artists.path,
      name: routes.artists.label,
      icon: routes.artists.icon
    }),
    menu: true
  },
  album: {
    label: "Album",
    icon: "album",
    path: "/album/:artist/:album",
    component: Album,
    nav: (artist, album) => ({
      path: "/album/" + artist + "/" + album,
      name: artist,
      icon: routes.album.icon
    })
  },
  settings: {
    label: "Settings",
    icon: "settings",
    path: "/settings",
    component: Settings,
    nav: () => ({
      path: routes.settings.path,
      name: routes.settings.label,
      icon: routes.settings.icon
    })
  },
  unassigned: {
    label: "Unassigned",
    icon: "error_outline",
    path: "/unassigned",
		component: Unassigned,
		nav: () => ({
      path: routes.unassigned.path,
      name: routes.unassigned.label,
      icon: routes.unassigned.icon
    }),
    menu: true
  }
};
