import { useState } from "react";

import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import type { Playlist, PlaylistCreate } from "../types";

type Props = {
  initial?: Playlist;
  onSubmit: (data: PlaylistCreate) => void;
  onCancel: () => void;
  submitting?: boolean;
};

export default function PlaylistForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim() || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>
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
