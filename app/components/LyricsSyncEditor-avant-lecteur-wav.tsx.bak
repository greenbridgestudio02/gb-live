"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Song } from "../../types/show";

type LyricsSyncEditorProps = {
  song: Song;
  onValidate: (times: number[]) => void;
};

export default function LyricsSyncEditor({
  song,
  onValidate,
}: LyricsSyncEditorProps) {
  const lyricLines = useMemo(
    () => song.lyricLines ?? [],
    [song.lyricLines]
  );

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [times, setTimes] = useState<number[]>(
    lyricLines.map(() => 0)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setTimes(lyricLines.map(() => 0));
    setCurrentIndex(0);
    startTimeRef.current = null;
  }, [song.id, lyricLines]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    function update() {
      if (startTimeRef.current !== null) {
        const elapsed =
          (performance.now() - startTimeRef.current) / 1000;

        setElapsedTime(elapsed);
      }

      animationFrameRef.current =
        requestAnimationFrame(update);
    }

    animationFrameRef.current =
      requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  function startSync() {
    setTimes(lyricLines.map(() => 0));
    setCurrentIndex(0);
    setElapsedTime(0);
    startTimeRef.current = performance.now();
    setIsRunning(true);
  }

  function markCurrentLine() {
    if (!isRunning) {
      return;
    }

    if (currentIndex >= lyricLines.length) {
      return;
    }

    const currentTime =
      startTimeRef.current !== null
        ? (performance.now() - startTimeRef.current) / 1000
        : elapsedTime;

    setTimes((currentTimes) => {
      const newTimes = [...currentTimes];
      newTimes[currentIndex] = currentTime;
      return newTimes;
    });

    if (currentIndex === lyricLines.length - 1) {
      setCurrentIndex(lyricLines.length);
      setIsRunning(false);
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  function goBackOneLine() {
    if (currentIndex === 0) {
      return;
    }

    const previousIndex = Math.min(
      currentIndex - 1,
      lyricLines.length - 1
    );

    setCurrentIndex(previousIndex);

    setTimes((currentTimes) => {
      const newTimes = [...currentTimes];

      for (
        let index = previousIndex;
        index < newTimes.length;
        index++
      ) {
        newTimes[index] = 0;
      }

      return newTimes;
    });
  }

  function resetSync() {
    setIsRunning(false);
    setElapsedTime(0);
    setTimes(lyricLines.map(() => 0));
    setCurrentIndex(0);
    startTimeRef.current = null;
  }

  function validateSync() {
    const allLinesMarked =
      lyricLines.length > 0 &&
      times.every((time) => time > 0);

    if (!allLinesMarked) {
      return;
    }

    onValidate(times);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space") {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.repeat) {
        return;
      }

      event.preventDefault();

      markCurrentLine();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isRunning,
    currentIndex,
    elapsedTime,
    lyricLines.length,
  ]);

  const previousLine =
    currentIndex > 0 &&
    currentIndex <= lyricLines.length
      ? lyricLines[currentIndex - 1]
      : null;

  const currentLine =
    currentIndex < lyricLines.length
      ? lyricLines[currentIndex]
      : null;

  const nextLine =
    currentIndex >= 0 &&
    currentIndex < lyricLines.length - 1
      ? lyricLines[currentIndex + 1]
      : null;

  const allLinesMarked =
    lyricLines.length > 0 &&
    times.every((time) => time > 0);

  return (
    <div className="flex h-[calc(100vh-7rem)] min-h-0 flex-col rounded-3xl border border-zinc-700 bg-zinc-950 p-4 text-zinc-100">
      <div className="shrink-0 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
          G3 Live
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Synchroniser les paroles
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {song.title}
        </p>
      </div>

      {lyricLines.length === 0 ? (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-amber-800 bg-amber-950/30 p-6 text-center text-amber-300">
          Aucune phrase à synchroniser.
        </div>
      ) : (
        <>
          <div className="mt-4 grid shrink-0 grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Phrase
              </p>

              <p className="mt-1 text-xl font-bold">
                {Math.min(
                  currentIndex + 1,
                  lyricLines.length
                )}{" "}
                / {lyricLines.length}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Temps
              </p>

              <p className="mt-1 text-xl font-bold tabular-nums">
                {elapsedTime.toFixed(1)} s
              </p>
            </div>
          </div>

          {!isRunning && currentIndex === 0 ? (
            <div className="mt-4 flex min-h-0 flex-1 items-center justify-center">
              <button
                type="button"
                onClick={startSync}
                className="w-full rounded-2xl bg-emerald-500 px-8 py-8 text-2xl font-bold text-zinc-950"
              >
                ▶ Démarrer la synchronisation
              </button>
            </div>
          ) : currentIndex < lyricLines.length ? (
            <button
              type="button"
              onClick={markCurrentLine}
              disabled={!isRunning}
              className="mt-4 flex min-h-0 flex-1 select-none touch-manipulation flex-col items-center justify-center rounded-3xl border-2 border-emerald-700 bg-emerald-950/30 px-6 py-4 text-center active:scale-[0.995] disabled:opacity-40"
            >
              <div className="min-h-10">
                {previousLine && (
                  <p className="text-lg text-zinc-600">
                    {previousLine.text}
                  </p>
                )}
              </div>

              <div className="my-4 flex min-h-24 items-center justify-center">
                {currentLine && (
                  <p className="text-4xl font-black leading-tight text-emerald-300">
                    {currentLine.text}
                  </p>
                )}
              </div>

              <div className="min-h-10">
                {nextLine && (
                  <p className="text-xl text-zinc-500">
                    {nextLine.text}
                  </p>
                )}
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
                Touchez cette zone pour marquer la phrase
              </p>
            </button>
          ) : (
            <div className="mt-4 flex min-h-0 flex-1 items-center justify-center rounded-3xl border border-emerald-800 bg-emerald-950/30 p-8 text-center">
              <div>
                <p className="text-4xl">✓</p>

                <p className="mt-4 text-2xl font-bold text-emerald-300">
                  Synchronisation terminée
                </p>

                <p className="mt-2 text-zinc-500">
                  Toutes les phrases ont été marquées.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 grid shrink-0 grid-cols-2 gap-3">
            <button
              type="button"
              onClick={goBackOneLine}
              disabled={currentIndex === 0}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold disabled:opacity-30"
            >
              ← Revenir
            </button>

            <button
              type="button"
              onClick={resetSync}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold"
            >
              ↺ Recommencer
            </button>
          </div>

          <button
            type="button"
            onClick={validateSync}
            disabled={!allLinesMarked}
            className="mt-3 shrink-0 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Valider la synchronisation
          </button>
        </>
      )}
    </div>
  );
}