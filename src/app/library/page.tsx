"use client";

import { Upload } from "lucide-react";
import { TrackList } from "@/components/TrackList";
import { useLibrary } from "@/lib/useLibrary";

export default function LibraryPage() {
  const { tracks, loading, add, remove } = useLibrary();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your Library</h1>
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-violet px-4 py-2 text-sm font-medium text-ink">
          <Upload size={16} />
          Add audio files
          <input
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              if (e.target.files) await add(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="mb-6 mt-2 text-sm text-muted">
        Files stay on this device, inside your browser. Only add music you own or have
        the right to use.
      </p>
      {loading ? null : tracks.length === 0 ? (
        <p className="text-sm text-muted">Your library is empty.</p>
      ) : (
        <TrackList tracks={tracks} onRemove={remove} />
      )}
    </div>
  );
}
