import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { musicApi } from "../api";
import SongForm from "../components/SongForm";
import type { SongCreate } from "../types";

export default function SongList() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: songs, isLoading, error } = useQuery({
    queryKey: ["music", "songs"],
    queryFn: musicApi.listSongs,
  });

  const createMutation = useMutation({
    mutationFn: (data: SongCreate) => musicApi.createSong(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["music", "songs"] });
      setOpen(false);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Songs</h1>
        <Button onClick={() => setOpen(true)}>Add song</Button>
      </div>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">Failed to load songs.</p>}

      {songs && songs.length === 0 && (
        <p className="text-gray-500">No songs yet.</p>
      )}

      {songs && songs.length > 0 && (
        <div className="overflow-hidden rounded border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Artist</th>
                <th className="px-4 py-2">Album</th>
                <th className="px-4 py-2">Year</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link
                      to={`/music/songs/${s.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {s.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{s.artist}</td>
                  <td className="px-4 py-2">{s.album ?? "—"}</td>
                  <td className="px-4 py-2">{s.year ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title="Add song" onClose={() => setOpen(false)}>
        <SongForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setOpen(false)}
          submitting={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}
