export type Song = {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  duration_seconds: number | null;
  year: number | null;
  created_at: string;
};

export type SongCreate = {
  title: string;
  artist: string;
  album?: string | null;
  duration_seconds?: number | null;
  year?: number | null;
};

export type SongUpdate = Partial<SongCreate>;

export type Playlist = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type PlaylistDetail = Playlist & {
  songs: Song[];
};

export type PlaylistCreate = {
  name: string;
  description?: string | null;
};

export type PlaylistUpdate = Partial<PlaylistCreate>;
