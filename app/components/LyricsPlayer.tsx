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
  const hasSynchronizedLyrics =
    lyricLines.length > 0 && !song.needsLyricsSync;

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

  // MORCEAU INSTRUMENTAL
  if (isInstrumental) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="w-full max-w-4xl text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🎹</span>

              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
                  Instrumental
                </p>

                <h3 className="mt-1 text-4xl font-bold text-zinc-100">
                  {song.title}
                </h3>
              </div>
            </div>

            {(song.bpm || song.key) && (
              <div className="mt-4 flex items-center justify-center gap-6 text-lg text-zinc-400">
                {song.bpm && <span>♩ {song.bpm} BPM</span>}

                {song.key && (
                  <span>Tonalité : {song.key}</span>
                )}
              </div>
            )}

            <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Notes de scène
              </p>

              {song.stageNotes.trim() ? (
                <p className="mt-3 whitespace-pre-line text-xl font-medium leading-relaxed text-zinc-300">
                  {song.stageNotes}
                </p>
              ) : (
                <p className="mt-3 text-base text-zinc-600">
                  Aucune note de scène pour ce morceau.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MORCEAU CHANTÉ NON SYNCHRONISÉ
  if (!hasSynchronizedLyrics) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="mb-3 shrink-0 rounded-xl border border-amber-700 bg-amber-950/40 px-4 py-2 text-center">
          <p className="font-bold text-amber-300">
            ⚠ Paroles à synchroniser
          </p>

          <p className="mt-1 text-sm text-amber-200/70">
            Préparation → Synchroniser les paroles
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <div className="whitespace-pre-line text-center text-2xl font-medium leading-relaxed text-zinc-300">
            {song.lyrics || "Aucune parole enregistrée."}
          </div>
        </div>
      </div>
    </div>
  );
}

  // MORCEAU CHANTÉ SYNCHRONISÉ
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="w-full max-w-5xl text-center">
          <div className="min-h-16">
            {previousLine && (
              <p className="text-2xl font-medium leading-relaxed text-zinc-600">
                {previousLine.text}
              </p>
            )}
          </div>

          <div className="my-6 flex min-h-32 items-center justify-center">
            {currentLine && (
              <p className="text-5xl font-bold leading-tight text-emerald-300 transition-all duration-300">
                {currentLine.text}
              </p>
            )}
          </div>

          <div className="min-h-16">
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
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          className="min-w-48 rounded-xl bg-emerald-500 px-6 py-3 text-lg font-bold text-zinc-950"
        >
          {isPlaying ? "⏸ Paroles" : "▶ Paroles"}
        </button>

        <button
          type="button"
          onClick={resetLyrics}
          disabled={elapsedTime === 0}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold disabled:opacity-30"
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