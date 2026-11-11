import { localProvider } from "./local";
import type { MusicProvider, Track, TrackSource } from "./types";

// Add new providers (Jamendo, radio, ...) here in later stages.
const providers: Partial<Record<TrackSource, MusicProvider>> = {
  local: localProvider,
};

export function getProvider(source: TrackSource): MusicProvider {
  const provider = providers[source];
  if (!provider) throw new Error(`No provider registered for "${source}".`);
  return provider;
}

export function resolveStreamUrl(track: Track): Promise<string> {
  return getProvider(track.source).resolveStreamUrl(track);
}
