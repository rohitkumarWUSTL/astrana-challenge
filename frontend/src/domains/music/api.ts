import { apiRequest } from "@/core/api/client";
import type {
  Playlist,
  PlaylistCreate,
  PlaylistDetail,
  PlaylistUpdate,
  Song,
  SongCreate,
  SongUpdate,
} from "./types";

const BASE = "/api/music";

export const musicApi = {
  listSongs: () => apiRequest<Song[]>(`${BASE}/songs`),
  getSong: (id: number) => apiRequest<Song>(`${BASE}/songs/${id}`),
  createSong: (data: SongCreate) =>
    apiRequest<Song>(`${BASE}/songs`, { method: "POST", body: data }),
  updateSong: (id: number, data: SongUpdate) =>
    apiRequest<Song>(`${BASE}/songs/${id}`, { method: "PATCH", body: data }),
  deleteSong: (id: number) =>
    apiRequest<void>(`${BASE}/songs/${id}`, { method: "DELETE" }),

  listPlaylists: () => apiRequest<Playlist[]>(`${BASE}/playlists`),
  getPlaylist: (id: number) =>
    apiRequest<PlaylistDetail>(`${BASE}/playlists/${id}`),
  createPlaylist: (data: PlaylistCreate) =>
    apiRequest<Playlist>(`${BASE}/playlists`, { method: "POST", body: data }),
  updatePlaylist: (id: number, data: PlaylistUpdate) =>
    apiRequest<Playlist>(`${BASE}/playlists/${id}`, {
      method: "PATCH",
      body: data,
    }),
  deletePlaylist: (id: number) =>
    apiRequest<void>(`${BASE}/playlists/${id}`, { method: "DELETE" }),

  addSongToPlaylist: (playlistId: number, songId: number) =>
    apiRequest<PlaylistDetail>(`${BASE}/playlists/${playlistId}/songs`, {
      method: "POST",
      body: { song_id: songId },
    }),
  removeSongFromPlaylist: (playlistId: number, songId: number) =>
    apiRequest<PlaylistDetail>(
      `${BASE}/playlists/${playlistId}/songs/${songId}`,
      { method: "DELETE" }
    ),
};
