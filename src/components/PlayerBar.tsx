"use client";

import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { usePlayer } from "@/lib/player/PlayerContext";

function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const p = usePlayer();
  const RepeatIcon = p.repeat === "one" ? Repeat1 : Repeat;

  return (
    <footer className="grid h-24 shrink-0 grid-cols-[1fr_2fr] items-center gap-4 border-t border-line bg-panel px-6 sm:grid-cols-[1fr_2fr_1fr]">
      <div className="min-w-0">
        {p.current ? (
          <>
            <p className="truncate text-sm font-medium">{p.current.title}</p>
            <p className="truncate text-xs text-muted">{p.current.artist}</p>
            {p.error && <p className="truncate text-xs text-red-400">{p.error}</p>}
          </>
        ) : (
          <p className="text-sm text-muted">Nothing playing</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-5">
          <button
            onClick={p.toggleShuffle}
            aria-label="Shuffle"
            className={p.shuffle ? "text-cyan" : "text-muted hover:text-soft"}
          >
            <Shuffle size={16} />
          </button>
          <button onClick={p.prev} aria-label="Previous" className="text-soft">
            <SkipBack size={20} />
          </button>
          <button
            onClick={p.toggle}
            aria-label={p.playing ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-soft text-ink"
          >
            {p.playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button onClick={p.next} aria-label="Next" className="text-soft">
            <SkipForward size={20} />
          </button>
          <button
            onClick={p.cycleRepeat}
            aria-label="Repeat"
            className={p.repeat === "off" ? "text-muted hover:text-soft" : "text-cyan"}
          >
            <RepeatIcon size={16} />
          </button>
        </div>
        <div className="flex w-full max-w-xl items-center gap-3 text-xs text-muted">
          <span className="w-10 text-right tabular-nums">{fmt(p.time)}</span>
          <input
            type="range"
            min={0}
            max={p.duration || 0}
            step={0.5}
            value={Math.min(p.time, p.duration || 0)}
            onChange={(e) => p.seek(Number(e.target.value))}
            aria-label="Seek"
            className="h-1 flex-1 accent-cyan"
          />
          <span className="w-10 tabular-nums">{fmt(p.duration)}</span>
        </div>
      </div>

      <div className="hidden items-center justify-end gap-2 text-muted sm:flex">
        <Volume2 size={16} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={p.volume}
          onChange={(e) => p.setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="h-1 w-28 accent-cyan"
        />
      </div>
    </footer>
  );
}
