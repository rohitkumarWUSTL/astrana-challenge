import type { DomainModule } from "@/core/domains";
import PlaylistDetail from "./pages/PlaylistDetail";
import PlaylistList from "./pages/PlaylistList";
import SongDetail from "./pages/SongDetail";
import SongList from "./pages/SongList";

export const musicDomain: DomainModule = {
  name: "music",
  navLabel: "Music",
  basePath: "/music",
  routes: [
    { path: "/music", element: <SongList /> },
    { path: "/music/songs", element: <SongList /> },
    { path: "/music/songs/:id", element: <SongDetail /> },
    { path: "/music/playlists", element: <PlaylistList /> },
    { path: "/music/playlists/:id", element: <PlaylistDetail /> },
  ],
};
