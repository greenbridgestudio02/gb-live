"use client";

import { useState } from "react";
import type { Song } from "../../types/show";

type SongListProps = {
  songs: Song[];
  setlistPosition: number;
  currentSongId: string;
  onSelectSong: (index: number) => void;
  onMoveSong: (fromIndex: number, toIndex: number) => void;
  onClose: () => void;
};

export default function SongList({
  songs,
  setlistPosition,
  currentSongId,
  onSelectSong,
  onMoveSong,
  onClose,
}: SongListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  function selectSong(index: number) {
    onSelectSong(index);
    onClose();
  }

  function moveUp(index: number) {
    if (index === 0) {
      return;
    }

    onMoveSong(index, index - 1);
  }

  function moveDown(index: number) {
    if (index === songs.length - 1) {
      return;
    }

    onMoveSong(index, index + 1);
  }

  function handleDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    onMoveSong(draggedIndex, targetIndex);
    setDraggedIndex(null);
  }

  return (
    <div className="fixed inset-0 z-[60] flex bg-black/70">
      <aside className="flex h-full w-full max-w-lg flex-col border-r border-zinc-700 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              GreenBridge Live
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Setlist
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Glissez un morceau ou utilisez ▲ / ▼ pour modifier l’ordre.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold transition hover:bg-zinc-800"
            aria-label="Fermer la setlist"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {songs.map((song, index) => {
              const positionPrevue = index === setlistPosition;
              const morceauJoue = song.id === currentSongId;
              const dejaJoue = index < setlistPosition;

              return (
                <div
                  key={song.id}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragEnd={() => setDraggedIndex(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className={`flex items-center gap-2 rounded-xl border p-2 transition ${
                    positionPrevue
                      ? "border-emerald-500 bg-emerald-500/10"
                      : draggedIndex === index
                        ? "border-zinc-600 bg-zinc-800 opacity-60"
                        : "border-transparent bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <span
                    className="cursor-grab px-2 text-xl text-zinc-600 active:cursor-grabbing"
                    title="Déplacer"
                  >
                    ☰
                  </span>

                  <button
                    type="button"
                    onClick={() => selectSong(index)}
                    className="flex min-w-0 flex-1 items-center gap-3 p-2 text-left"
                  >
                    <span
                      className={`w-7 text-center text-lg font-bold ${
                        positionPrevue
                          ? "text-emerald-400"
                          : dejaJoue
                            ? "text-zinc-400"
                            : "text-zinc-600"
                      }`}
                    >
                      {positionPrevue ? "▶" : dejaJoue ? "✓" : ""}
                    </span>

                    <span className="text-sm font-semibold text-zinc-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-lg font-semibold">
                        {song.title}
                      </span>

                      <span className="mt-1 flex gap-2 text-xs text-zinc-500">
                        <span>{song.duration}</span>

                        {morceauJoue && !positionPrevue && (
                          <span className="font-semibold text-amber-400">
                            • joué actuellement
                          </span>
                        )}
                      </span>
                    </span>
                  </button>

                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="flex h-8 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-sm disabled:opacity-20"
                      aria-label="Monter le morceau"
                    >
                      ▲
                    </button>

                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === songs.length - 1}
                      className="flex h-8 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-sm disabled:opacity-20"
                      aria-label="Descendre le morceau"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg font-semibold transition hover:bg-zinc-800"
          >
            Fermer
          </button>
        </div>
      </aside>

      <button
        type="button"
        onClick={onClose}
        className="flex-1"
        aria-label="Fermer la setlist"
      />
    </div>
  );
}