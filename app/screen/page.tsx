"use client";

import { useEffect, useRef, useState } from "react";

type LyricLine = {
  time: number;
  text: string;
};

type LiveSong = {
  id: string;
  title: string;
  artist?: string;
  kind?: string;
  needsLyricsSync?: boolean;
  lyricLines?: LyricLine[];
};

type LiveState = {
  mode: string;
  song: LiveSong | null;
  elapsedTime: number;
  isPlaying: boolean;
  message: string;
  messageUpdatedAt: number;
  updatedAt: number;
};

const LYRICS_LEAD = 0.15;

export default function ScreenPage() {
  const [liveState, setLiveState] = useState<LiveState>({
    mode: "home",
    song: null,
    elapsedTime: 0,
    isPlaying: false,
    message: "",
    messageUpdatedAt: 0,
    updatedAt: 0,
  });

  const [displayElapsedTime, setDisplayElapsedTime] = useState(0);

  const clockStartRef = useRef<number | null>(null);
  const clockBaseRef = useRef(0);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function loadInitialState() {
      try {
        const response = await fetch("/api/live-state", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const state: LiveState = await response.json();
        setLiveState(state);
      } catch {
        // On conserve le dernier état connu.
      }
    }

    void loadInitialState();

    eventSource = new EventSource("/api/live-state?stream=1");

    eventSource.onmessage = (event) => {
      try {
        const state: LiveState = JSON.parse(event.data);
        setLiveState(state);
      } catch {
        // On conserve le dernier état valide.
      }
    };

    return () => {
      eventSource?.close();
    };
  }, []);

  useEffect(() => {
    clockBaseRef.current = liveState.elapsedTime;

    if (liveState.isPlaying) {
      clockStartRef.current = performance.now();
    } else {
      clockStartRef.current = null;
      setDisplayElapsedTime(
        liveState.elapsedTime + LYRICS_LEAD
      );
    }
  }, [
    liveState.elapsedTime,
    liveState.isPlaying,
    liveState.song?.id,
  ]);

  useEffect(() => {
    if (!liveState.isPlaying) return;

    let animationFrameId: number;

    function updateClock() {
      if (clockStartRef.current !== null) {
        const elapsed =
          clockBaseRef.current +
          (performance.now() - clockStartRef.current) / 1000;

        setDisplayElapsedTime(elapsed + LYRICS_LEAD);
      }

      animationFrameId =
        requestAnimationFrame(updateClock);
    }

    animationFrameId =
      requestAnimationFrame(updateClock);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    liveState.isPlaying,
    liveState.song?.id,
  ]);

  const currentSong = liveState.song;
  const lyricLines = currentSong?.lyricLines ?? [];

  let currentLineIndex = -1;

  if (lyricLines.length > 0) {
    currentLineIndex = 0;

    for (
      let index = 0;
      index < lyricLines.length;
      index++
    ) {
      if (
        displayElapsedTime >= lyricLines[index].time
      ) {
        currentLineIndex = index;
      } else {
        break;
      }
    }
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white">
      {!currentSong ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-semibold uppercase tracking-[0.5em] text-emerald-400">
              GB LIVE
            </p>

            <h1 className="mt-8 text-7xl font-black">
              Bienvenue
            </h1>

            <p className="mt-6 text-2xl text-zinc-500">
              by Green Bridge Studio
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <header className="shrink-0 px-12 py-8 text-center">
            <p className="text-lg font-semibold uppercase tracking-[0.45em] text-emerald-400">
              GB LIVE
            </p>

            <h1 className="mt-3 text-4xl font-black">
              {currentSong.title}
            </h1>

            {currentSong.artist && (
              <p className="mt-2 text-2xl text-zinc-500">
                {currentSong.artist}
              </p>
            )}
          </header>

          <section className="flex min-h-0 flex-1 items-center justify-center px-16">
            {lyricLines.length === 0 ? (
              <p className="text-3xl text-zinc-600">
                ♪
              </p>
            ) : (
              <div className="w-full max-w-6xl text-center">
                {lyricLines.map((line, index) => {
                  const distance =
                    index - currentLineIndex;

                  if (distance < -1 || distance > 2) {
                    return null;
                  }

                  const isCurrent = distance === 0;
                  const isPast = distance < 0;

                  return (
                    <div
                      key={`${line.time}-${index}`}
                      className={`py-4 font-bold leading-tight transition-all duration-300 ${
                        isCurrent
                          ? "text-6xl text-emerald-300"
                          : isPast
                            ? "text-3xl text-zinc-800"
                            : "text-4xl text-zinc-500"
                      }`}
                    >
                      {line.text}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <footer className="shrink-0 px-8 py-5 text-center text-sm text-zinc-700">
            GB Live • by Green Bridge Studio
          </footer>
        </div>
      )}
    </main>
  );
}