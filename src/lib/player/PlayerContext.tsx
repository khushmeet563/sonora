"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { resolveStreamUrl } from "@/lib/providers";
import type { Track } from "@/lib/providers/types";

export type RepeatMode = "off" | "all" | "one";

type PlayerApi = {
  current: Track | null;
  queue: Track[];
  index: number;
  playing: boolean;
  time: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  error: string | null;
  playQueue: (tracks: Track[], startIndex: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

const PlayerContext = createContext<PlayerApi | null>(null);

export function usePlayer(): PlayerApi {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const endedRef = useRef<() => void>(() => {});

  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [error, setError] = useState<string | null>(null);

  const current = index >= 0 ? (queue[index] ?? null) : null;

  // Create the audio element once.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTime = () => setTime(audio.currentTime);
    const onMeta = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => endedRef.current();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  // Load and play whenever the current track changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    let cancelled = false;

    (async () => {
      try {
        setError(null);
        setTime(0);
        const url = await resolveStreamUrl(current);
        if (cancelled) {
          if (url.startsWith("blob:")) URL.revokeObjectURL(url);
          return;
        }
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url.startsWith("blob:") ? url : null;
        audio.src = url;
        await audio.play();
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not play this track.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = useCallback(
    (auto = false) => {
      const audio = audioRef.current;
      if (queue.length === 0) return;
      if (auto && repeat === "one" && audio) {
        audio.currentTime = 0;
        void audio.play();
        return;
      }
      if (shuffle && queue.length > 1) {
        let n = index;
        while (n === index) n = Math.floor(Math.random() * queue.length);
        setIndex(n);
        return;
      }
      if (index + 1 < queue.length) {
        setIndex(index + 1);
        return;
      }
      if (repeat === "all") {
        if (queue.length === 1 && audio) {
          audio.currentTime = 0;
          void audio.play();
        } else {
          setIndex(0);
        }
        return;
      }
      if (auto) setPlaying(false);
    },
    [queue, index, repeat, shuffle],
  );

  useEffect(() => {
    endedRef.current = () => next(true);
  });

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || queue.length === 0) return;
    if (audio.currentTime > 3 || index <= 0) {
      audio.currentTime = 0;
      return;
    }
    setIndex(index - 1);
  }, [queue, index]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, [current]);

  const playQueue = useCallback((tracks: Track[], startIndex: number) => {
    setQueue(tracks);
    setIndex(startIndex);
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = seconds;
    setTime(seconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolumeState(v);
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const cycleRepeat = useCallback(
    () => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
    [],
  );

  // Media Session: lock-screen and keyboard media keys.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.metadata = current
      ? new MediaMetadata({
          title: current.title,
          artist: current.artist,
          album: current.album ?? "",
        })
      : null;
    ms.setActionHandler("play", () => void audioRef.current?.play());
    ms.setActionHandler("pause", () => audioRef.current?.pause());
    ms.setActionHandler("previoustrack", prev);
    ms.setActionHandler("nexttrack", () => next(false));
  }, [current, next, prev]);

  const value: PlayerApi = {
    current,
    queue,
    index,
    playing,
    time,
    duration,
    volume,
    shuffle,
    repeat,
    error,
    playQueue,
    toggle,
    next: () => next(false),
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
