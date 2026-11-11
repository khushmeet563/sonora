"use client";

import { Play, Trash2 } from "lucide-react";
import { usePlayer } from "@/lib/player/PlayerContext";
import type { Track } from "@/lib/providers/types";

export function TrackList({
  tracks,
  onRemove,
}: {
  tracks: Track[];
  onRemove?: (id: string) => void;
}) {
  const p = usePlayer();

  return (
    <ul className="divide-y divide-line rounded-xl border border-line bg-panel">
      {tracks.map((t, i) => {
        const active = p.current?.id === t.id;
        return (
          <li key={t.id} className="flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => p.playQueue(tracks, i)}
              aria-label={`Play ${t.title}`}
              className={active ? "text-cyan" : "text-muted hover:text-soft"}
            >
              <Play size={16} />
            </button>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm ${active ? "text-cyan" : ""}`}>{t.title}</p>
              <p className="truncate text-xs text-muted">{t.artist}</p>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(t.id)}
                aria-label={`Remove ${t.title}`}
                className="text-muted hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
