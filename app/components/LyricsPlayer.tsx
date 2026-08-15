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

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        {lyricLines.length > 0 ? (
          <div className="space-y-6">
            {lyricLines.map((line, index) => {
              const isCurrent = index === currentLineIndex;
              const isPast = index < currentLineIndex;

              return (
                <p
                  key={`${line.time}-${index}`}
                  className={`text-3xl font-medium leading-relaxed transition-all duration-300 ${
                    isCurrent
                      ? "scale-[1.02] text-emerald-300"
                      : isPast
                        ? "text-zinc-600"
                        : "text-zinc-300"
                  }`}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        ) : (
          <div className="whitespace-pre-line text-3xl font-medium leading-relaxed text-zinc-100">
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