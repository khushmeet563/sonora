"use client";

import Link from "next/link";
import { TrackList } from "@/components/TrackList";
import { useLibrary } from "@/lib/useLibrary";

export default function HomePage() {
  const { tracks, loading } = useLibrary();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold">Welcome to SONORA</h1>
      <p className="mt-2 text-muted">Your personal music environment.</p>

      <h2 className="mb-3 mt-10 text-sm font-medium uppercase tracking-widest text-muted">
        Your music
      </h2>
      {loading ? null : tracks.length === 0 ? (
        <p className="text-sm text-muted">
          Nothing here yet.{" "}
          <Link href="/library" className="text-cyan underline">
            Add some of your own audio files
          </Link>
          .
        </p>
      ) : (
        <TrackList tracks={tracks.slice(0, 10)} />
      )}
    </div>
  );
}
