"use client";

import { useEffect, useState } from "react";

type PublicLyricLine = {
  time: number;
  text: string;
};

type PublicSong = {
  id: string;
  title: string;
  kind?: "vocal" | "instrumental";
  lyrics: string;
  lyricLines: PublicLyricLine[];
  needsLyricsSync?: boolean;
};

type LiveState = {
  song: PublicSong | null;
  elapsedTime: number;
  isPlaying: boolean;
  updatedAt: number;
};

export default function PublicPage() {
  const [liveState, setLiveState] = useState<LiveState>({
    song: null,
    elapsedTime: 0,
    isPlaying: false,
    updatedAt: 0,
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let stopped = false;

    async function refreshLiveState() {
      try {
        const response = await fetch("/api/live-state", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!stopped) {
            setConnected(false);
          }

          return;
        }

        const state: LiveState = await response.json();

        if (!stopped) {
          setLiveState(state);
          setConnected(true);
        }
      } catch {
        if (!stopped) {
          setConnected(false);
        }
      }
    }

    void refreshLiveState();

    const intervalId = window.setInterval(() => {
      void refreshLiveState();
    }, 250);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const currentSong = liveState.song;
  const lyricLines = currentSong?.lyricLines ?? [];

  let currentLineIndex = -1;

  if (lyricLines.length > 0) {
    currentLineIndex = 0;

    for (let index = 0; index < lyricLines.length; index++) {
      if (liveState.elapsedTime >= lyricLines[index].time) {
        currentLineIndex = index;
      } else {
        break;
      }
    }
  }

  const currentLine =
    currentLineIndex >= 0
      ? lyricLines[currentLineIndex]
      : null;

  const nextLine =
    currentLineIndex >= 0 &&
    currentLineIndex < lyricLines.length - 1
      ? lyricLines[currentLineIndex + 1]
      : null;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-black text-white">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-900 px-8 py-4">
        <img
          src="/g3-live-logo.png"
          alt="G3 Live"
          className="h-20 w-auto object-contain"
        />

        <div className="text-right">
          <p
            className={`text-xs uppercase tracking-[0.25em] ${
              connected
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {connected ? "Live connecté" : "Connexion..."}
          </p>

          {currentSong && (
            <p className="mt-1 text-2xl font-bold">
              {currentSong.title}
            </p>
          )}
        </div>
      </header>

      <section className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-10 py-8">
        {!currentSong ? (
          <div className="text-center">
            <p className="text-5xl font-bold text-zinc-700">
              G3 Live
            </p>

            <p className="mt-4 text-xl text-zinc-600">
              En attente du prochain morceau
            </p>
          </div>
        ) : currentSong.kind === "instrumental" ? (
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-400">
              Instrumental
            </p>

            <h1 className="mt-4 text-6xl font-bold">
              {currentSong.title}
            </h1>
          </div>
        ) : currentSong.needsLyricsSync ||
          lyricLines.length === 0 ? (
          <div className="text-center">
            <h1 className="text-5xl font-bold">
              {currentSong.title}
            </h1>

            <p className="mt-6 text-xl text-zinc-600">
              Paroles indisponibles pour le moment
            </p>
          </div>
        ) : (
          <div className="w-full max-w-6xl text-center">
            <div className="flex min-h-32 items-center justify-center">
              {currentLine && (
                <p className="text-6xl font-bold leading-tight text-white">
                  {currentLine.text}
                </p>
              )}
            </div>

            <div className="mt-12 flex min-h-24 items-center justify-center">
              {nextLine ? (
                <p className="text-3xl font-medium leading-relaxed text-zinc-600">
                  {nextLine.text}
                </p>
              ) : (
                <p className="text-xl text-zinc-800">
                  Fin des paroles
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <footer className="shrink-0 border-t border-zinc-900 px-8 py-3 text-center text-sm text-zinc-700">
        G3 Live • by Green Bridge Studio
      </footer>
    </main>
  );
}