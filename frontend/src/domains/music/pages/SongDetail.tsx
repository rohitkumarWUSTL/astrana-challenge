import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { musicApi } from "../api";
import SongForm from "../components/SongForm";
import type { SongCreate } from "../types";

export default function SongDetail() {
  const { id } = useParams<{ id: string }>();
  const songId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: song, isLoading, error } = useQuery({
    queryKey: ["music", "songs", songId],
    queryFn: () => musicApi.getSong(songId),
    enabled: Number.isFinite(songId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: SongCreate) => musicApi.updateSong(songId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["music", "songs"] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => musicApi.deleteSong(songId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["music", "songs"] });
      navigate("/music/songs");
    },
  });

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error || !song) return <p className="text-red-600">Song not found.</p>;

  return (
    <div>
      <Link to="/music/songs" className="text-sm text-blue-600 hover:underline">
        ← Back to songs
      </Link>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{song.title}</h1>
          <p className="text-gray-600">{song.artist}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm("Delete this song?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Album</dt>
          <dd>{song.album ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Year</dt>
          <dd>{song.year ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Duration</dt>
          <dd>
            {song.duration_seconds != null
              ? `${song.duration_seconds}s`
              : "—"}
          </dd>
        </div>
      </dl>

      <Modal open={editing} title="Edit song" onClose={() => setEditing(false)}>
        <SongForm
          initial={song}
          onSubmit={(data) => updateMutation.mutate(data)}
          onCancel={() => setEditing(false)}
          submitting={updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
