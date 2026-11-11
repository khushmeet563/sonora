export type TrackSource = "local" | "jamendo" | "radio";

export type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  durationSec?: number;
  artworkUrl?: string;
  source: TrackSource;
  license?: string;
};

export type ProviderCapabilities = {
  canSearch: boolean;
  canPlay: boolean;
  requiresAuth: boolean;
  requiresSubscription: boolean;
};

export interface MusicProvider {
  id: TrackSource;
  name: string;
  capabilities: ProviderCapabilities;
  search(query: string): Promise<Track[]>;
  resolveStreamUrl(track: Track): Promise<string>;
}
