import { useState } from "react";

import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import type { Song, SongCreate } from "../types";

type Props = {
  initial?: Song;
  onSubmit: (data: SongCreate) => void;
  onCancel: () => void;
  submitting?: boolean;
};

export default function SongForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [album, setAlbum] = useState(initial?.album ?? "");
  const [duration, setDuration] = useState(
    initial?.duration_seconds != null ? String(initial.duration_seconds) : ""
  );
  const [year, setYear] = useState(
    initial?.year != null ? String(initial.year) : ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || null,
      duration_seconds: duration ? Number(duration) : null,
      year: year ? Number(year) : null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        label="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        required
      />
      <Input
        label="Album"
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Duration (s)"
          type="number"
          min={0}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <Input
          label="Year"
          type="number"
          min={0}
          max={9999}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
