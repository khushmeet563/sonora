"use client";

import { useCallback, useEffect, useState } from "react";
import { addFiles, listTracks, removeTrack } from "@/lib/providers/local";
import type { Track } from "@/lib/providers/types";

export function useLibrary() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setTracks(await listTracks());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (files: FileList | File[]) => {
      await addFiles(files);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await removeTrack(id);
      await refresh();
    },
    [refresh],
  );

  return { tracks, loading, add, remove };
}
