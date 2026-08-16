"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Song } from "../../types/show";

type LyricsPlayerProps = {
  song: Song;
};

export default function LyricsPlayer({ song }: LyricsPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const pausedElapsedRef = useRef(0);

  const isInstrumental = song.kind === "instrumental";
  const lyricLines = song.lyricLines ?? [];

  const currentLineIndex = useMemo(() => {
    if (lyricLines.length === 0) {
      return -1;
    }

    let activeIndex = 0;

    for (let index = 0; index < lyricLines.length; index++) {
      if (elapsedTime >= lyricLines[index].time) {
        activeIndex = index;
      } else {
        break;
      }
    }

    return activeIndex;
  }, [elapsedTime, lyricLines]);

  const previousLine =
    currentLineIndex > 0
      ? lyricLines[currentLineIndex - 1]
      : null;

  const currentLine =
    currentLineIndex >= 0
      ? lyricLines[currentLineIndex]
      : null;

  const nextLine =
    currentLineIndex >= 0 &&
    currentLineIndex < lyricLines.length - 1
      ? lyricLines[currentLineIndex + 1]
      : null;

  useEffect(() => {
    setIsPlaying(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    pausedElapsedRef.current = 0;
  }, [song.id]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let animationFrameId: number;

    function update() {
      if (startTimeRef.current !== null) {
        const elapsed =
          pausedElapsedRef.current +
          (performance.now() - startTimeRef.current) / 1000;

        setElapsedTime(elapsed);
      }

      animationFrameId = requestAnimationFrame(update);
    }

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  function togglePlayback() {
    if (isPlaying) {
      pausedElapsedRef.current = elapsedTime;
      startTimeRef.current = null;
      setIsPlaying(false);
      return;
    }

    startTimeRef.current = performance.now();
    setIsPlaying(true);
  }

  function resetLyrics() {
    setIsPlaying(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    pausedElapsedRef.current = 0;
  }

  if (isInstrumental) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="w-full max-w-4xl text-center">
            <p className="text-6xl">
              🎹
            </p>

            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
              Instrumental
            </p>

            <h3 className="mt-3 text-5xl font-bold text-zinc-100">
              {song.title}
            </h3>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Notes de scène
              </p>

              {song.stageNotes.trim() ? (
                <p className="mt-4 whitespace-pre-line text-2xl font-medium leading-relaxed text-zinc-300">
                  {song.stageNotes}
                </p>
              ) : (
                <p className="mt-4 text-lg text-zinc-600">
                  Aucune note de scène pour ce morceau.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        {lyricLines.length > 0 ? (
          <div className="w-full max-w-5xl text-center">
            <div className="min-h-20">
              {previousLine && (
                <p className="text-2xl font-medium leading-relaxed text-zinc-600">
                  {previousLine.text}
                </p>
              )}
            </div>

            <div className="my-10 flex min-h-40 items-center justify-center">
              {currentLine && (
                <p className="text-5xl font-bold leading-tight text-emerald-300 transition-all duration-300">
                  {currentLine.text}
                </p>
              )}
            </div>

            <div className="min-h-20">
              {nextLine ? (
                <p className="text-3xl font-medium leading-relaxed text-zinc-400">
                  {nextLine.text}
                </p>
              ) : (
                <p className="text-xl font-medium text-zinc-600">
                  Fin des paroles
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full whitespace-pre-line text-center text-3xl font-medium leading-relaxed text-zinc-100">
            {song.lyrics}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          disabled={lyricLines.length === 0}
          className="min-w-48 rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isPlaying ? "⏸ Paroles" : "▶ Paroles"}
        </button>

        <button
          type="button"
          onClick={resetLyrics}
          disabled={elapsedTime === 0}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 font-semibold disabled:opacity-30"
        >
          ↺ Remettre au début
        </button>

        <div className="min-w-20 text-center text-sm tabular-nums text-zinc-500">
          {elapsedTime.toFixed(1)} s
        </div>
      </div>
    </div>
  );
}