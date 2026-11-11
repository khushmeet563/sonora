import { del, get, keys, set } from "idb-keyval";
import type { MusicProvider, Track } from "./types";

const PREFIX = "sonora:track:";

type Stored = { meta: Track; file: Blob };

export async function addFiles(files: FileList | File[]): Promise<Track[]> {
  const added: Track[] = [];
  for (const file of Array.from(files)) {
    if (!file.type.startsWith("audio/")) continue;
    const id = crypto.randomUUID();
    const title = file.name.replace(/\.[^/.]+$/, "");
    const meta: Track = { id, title, artist: "Unknown artist", source: "local" };
    const record: Stored = { meta, file };
    await set(PREFIX + id, record);
    added.push(meta);
  }
  return added;
}

export async function listTracks(): Promise<Track[]> {
  const all = await keys();
  const out: Track[] = [];
  for (const key of all) {
    if (typeof key === "string" && key.startsWith(PREFIX)) {
      const stored = await get<Stored>(key);
      if (stored) out.push(stored.meta);
    }
  }
  return out.sort((a, b) => a.title.localeCompare(b.title));
}

export async function removeTrack(id: string): Promise<void> {
  await del(PREFIX + id);
}

export const localProvider: MusicProvider = {
  id: "local",
  name: "Your files",
  capabilities: {
    canSearch: true,
    canPlay: true,
    requiresAuth: false,
    requiresSubscription: false,
  },
  async search(query) {
    const q = query.trim().toLowerCase();
    const tracks = await listTracks();
    return q ? tracks.filter((t) => t.title.toLowerCase().includes(q)) : tracks;
  },
  async resolveStreamUrl(track) {
    const stored = await get<Stored>(PREFIX + track.id);
    if (!stored) throw new Error("This file is no longer in your library.");
    return URL.createObjectURL(stored.file);
  },
};
