import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { musicApi } from "../api";
import PlaylistForm from "../components/PlaylistForm";
import type { PlaylistCreate } from "../types";

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const playlistId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [addingSong, setAddingSong] = useState(false);

  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ["music", "playlists", playlistId],
    queryFn: () => musicApi.getPlaylist(playlistId),
    enabled: Number.isFinite(playlistId),
  });

  const { data: allSongs } = useQuery({
    queryKey: ["music", "songs"],
    queryFn: musicApi.listSongs,
    enabled: addingSong,
  });

  const updateMutation = useMutation({
    mutationFn: (data: PlaylistCreate) =>
      musicApi.updatePlaylist(playlistId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["music", "playlists"] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => musicApi.deletePlaylist(playlistId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["music", "playlists"] });
      navigate("/music/playlists");
    },
  });

  const addSongMutation = useMutation({
    mutationFn: (songId: number) =>
      musicApi.addSongToPlaylist(playlistId, songId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["music", "playlists", playlistId],
      });
      setAddingSong(false);
    },
  });

  const removeSongMutation = useMutation({
    mutationFn: (songId: number) =>
      musicApi.removeSongFromPlaylist(playlistId, songId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["music", "playlists", playlistId],
      });
    },
  });

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error || !playlist)
    return <p className="text-red-600">Playlist not found.</p>;

  const inPlaylist = new Set(playlist.songs.map((s) => s.id));
  const availableSongs = (allSongs ?? []).filter((s) => !inPlaylist.has(s.id));

  return (
    <div>
      <Link
        to="/music/playlists"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to playlists
      </Link>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-gray-600 mt-1">{playlist.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Delete this playlist?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Songs</h2>
        <Button onClick={() => setAddingSong(true)}>Add song</Button>
      </div>

      {playlist.songs.length === 0 ? (
        <p className="mt-2 text-gray-500">No songs in this playlist.</p>
      ) : (
        <ul className="mt-2 divide-y rounded border bg-white">
          {playlist.songs.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between px-4 py-2"
            >
              <div>
                <Link
                  to={`/music/songs/${s.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {s.title}
                </Link>
                <span className="text-gray-500 text-sm ml-2">— {s.artist}</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => removeSongMutation.mutate(s.id)}
                disabled={removeSongMutation.isPending}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editing}
        title="Edit playlist"
        onClose={() => setEditing(false)}
      >
        <PlaylistForm
          initial={playlist}
          onSubmit={(data) => updateMutation.mutate(data)}
          onCancel={() => setEditing(false)}
          submitting={updateMutation.isPending}
        />
      </Modal>

      <Modal
        open={addingSong}
        title="Add song to playlist"
        onClose={() => setAddingSong(false)}
      >
        {availableSongs.length === 0 ? (
          <p className="text-gray-500">No songs available to add.</p>
        ) : (
          <ul className="max-h-80 overflow-y-auto divide-y">
            {availableSongs.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-sm text-gray-500">{s.artist}</div>
                </div>
                <Button
                  onClick={() => addSongMutation.mutate(s.id)}
                  disabled={addSongMutation.isPending}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
