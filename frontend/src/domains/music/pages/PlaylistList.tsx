import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { musicApi } from "../api";
import PlaylistForm from "../components/PlaylistForm";
import type { PlaylistCreate } from "../types";

export default function PlaylistList() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: playlists, isLoading, error } = useQuery({
    queryKey: ["music", "playlists"],
    queryFn: musicApi.listPlaylists,
  });

  const createMutation = useMutation({
    mutationFn: (data: PlaylistCreate) => musicApi.createPlaylist(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["music", "playlists"] });
      setOpen(false);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Playlists</h1>
        <Button onClick={() => setOpen(true)}>New playlist</Button>
      </div>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">Failed to load playlists.</p>}

      {playlists && playlists.length === 0 && (
        <p className="text-gray-500">No playlists yet.</p>
      )}

      {playlists && playlists.length > 0 && (
        <ul className="divide-y rounded border bg-white">
          {playlists.map((p) => (
            <li key={p.id} className="px-4 py-3 hover:bg-gray-50">
              <Link
                to={`/music/playlists/${p.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {p.name}
              </Link>
              {p.description && (
                <p className="text-sm text-gray-600 mt-0.5">{p.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        title="New playlist"
        onClose={() => setOpen(false)}
      >
        <PlaylistForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setOpen(false)}
          submitting={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
