"use client";

import { useEffect, useRef, useState } from "react";
import type { Song } from "../../types/show";

type LyricsSyncEditorProps = {
  song: Song;
  onValidate: (times: number[]) => void;
};

export default function LyricsSyncEditor({
  song,
  onValidate
}: LyricsSyncEditorProps) {
  const lines = song.lyricLines ?? [];

  const [isRecording, setIsRecording] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [recordedTimes, setRecordedTimes] = useState<number[]>([]);

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setIsRecording(false);
    setCurrentLineIndex(0);
    setRecordedTimes([]);
    startTimeRef.current = null;
  }, [song.id]);

  function startRecording() {
    setRecordedTimes([]);
    setCurrentLineIndex(0);
    startTimeRef.current = performance.now();
    setIsRecording(true);
  }

  function stopRecording() {
    setIsRecording(false);
    startTimeRef.current = null;
  }

  function undoLastRecording() {
  setRecordedTimes((times) => {
    if (times.length === 0) {
      return times;
    }

    return times.slice(0, -1);
  });

  setCurrentLineIndex((index) => Math.max(index - 1, 0));

  if (!isRecording) {
    setIsRecording(true);
    startTimeRef.current = performance.now();
  }
}
  
function validateSynchronization() {
  if (recordedTimes.length !== lines.length) {
    return;
  }

  onValidate(recordedTimes);
}



function recordCurrentLine() {
    if (!isRecording || startTimeRef.current === null) {
      return;
    }

    if (currentLineIndex >= lines.length) {
      return;
    }

    const elapsed =
      (performance.now() - startTimeRef.current) / 1000;

    setRecordedTimes((times) => [
      ...times,
      Number(elapsed.toFixed(2)),
    ]);

    const nextIndex = currentLineIndex + 1;

    if (nextIndex >= lines.length) {
      setCurrentLineIndex(nextIndex);
      stopRecording();
    } else {
      setCurrentLineIndex(nextIndex);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space") {
        return;
      }

      if (!isRecording) {
        return;
      }

      event.preventDefault();
      recordCurrentLine();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Synchronisation des paroles
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {song.title}
          </h2>

          <p className="mt-2 text-zinc-500">
            Appuyez sur ESPACE au début de chaque phrase.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Phrase
          </p>

          <p className="mt-1 text-2xl font-bold">
            {Math.min(currentLineIndex + 1, lines.length)} / {lines.length}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {lines.map((line, index) => {
          const recordedTime = recordedTimes[index];
          const isCurrent =
            isRecording && index === currentLineIndex;
          const isRecorded = recordedTime !== undefined;

          return (
            <div
              key={`${line.text}-${index}`}
              className={`rounded-2xl border p-4 transition ${
                isCurrent
                  ? "border-emerald-500 bg-emerald-500/10"
                  : isRecorded
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-10 text-sm font-semibold text-zinc-600">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 text-lg font-medium">
                  {line.text}
                </span>

                <span className="min-w-20 text-right text-sm tabular-nums text-zinc-500">
                  {isRecorded
                    ? `${recordedTime.toFixed(2)} s`
                    : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={lines.length === 0}
            className="rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-zinc-950 disabled:opacity-30"
          >
            ▶ Démarrer la synchronisation
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={recordCurrentLine}
              className="rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-zinc-950"
            >
              ESPACE — Phrase suivante
            </button>

            <button
              type="button"
              onClick={stopRecording}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold"
            >
              Arrêter
            </button>
          </>
        )}

            <button
                type="button"
                onClick={undoLastRecording}
                disabled={recordedTimes.length === 0}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold disabled:opacity-30"
            >
                ↶ Annuler la dernière frappe
            </button>


        <button
          type="button"
          onClick={() => {
            setIsRecording(false);
            setCurrentLineIndex(0);
            setRecordedTimes([]);
            startTimeRef.current = null;
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold"
        >
          ↺ Recommencer
        </button>


        <button
            type="button"
            onClick={validateSynchronization}
            disabled={
                lines.length === 0 ||
                recordedTimes.length !== lines.length
        }
            className="rounded-xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 disabled:opacity-30"
        >
            ✓ Valider la synchronisation
        </button>
      </div>

      {recordedTimes.length === lines.length &&
        lines.length > 0 && (
          <div className="mt-6 rounded-2xl border border-emerald-800 bg-emerald-950/30 p-5">
            <p className="font-semibold text-emerald-300">
              Synchronisation terminée.
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Les temps sont encore temporaires. Nous ajouterons
              ensuite la validation et l’enregistrement dans le morceau.
            </p>
          </div>
        )}
    </div>
  );
}