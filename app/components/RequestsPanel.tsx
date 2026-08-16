"use client";

import { useState } from "react";
import type { Song } from "../../types/show";

type RequestsPanelProps = {
  songs: Song[];
  requestedSongIds: string[];
  onPlayNow: (songId: string) => void;
  onPlayNext: (songId: string) => void;
  onRemoveRequest: (songId: string) => void;
  onMoveRequest: (fromIndex: number, toIndex: number) => void;
  onClose: () => void;
};

export default function RequestsPanel({
  songs,
  requestedSongIds,
  onPlayNow,
  onPlayNext,
  onRemoveRequest,
  onMoveRequest,
  onClose,
}: RequestsPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const requestedSongs = requestedSongIds
    .map((songId) => songs.find((song) => song.id === songId))
    .filter((song): song is Song => song !== undefined);

  function moveUp(index: number) {
    if (index === 0) {
      return;
    }

    onMoveRequest(index, index - 1);
  }

  function moveDown(index: number) {
    if (index === requestedSongs.length - 1) {
      return;
    }

    onMoveRequest(index, index + 1);
  }

  function handleDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    onMoveRequest(draggedIndex, targetIndex);
    setDraggedIndex(null);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/80 p-6 pt-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-amber-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              G3 Live
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Demandes du public
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {requestedSongs.length} demande
              {requestedSongs.length > 1 ? "s" : ""} en attente
            </p>

            {requestedSongs.length > 1 && (
              <p className="mt-2 text-xs text-zinc-600">
                Glissez les demandes ou utilisez ▲ / ▼ pour modifier leur priorité.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
            aria-label="Fermer les demandes"
          >
            ×
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {requestedSongs.length > 0 ? (
            <div className="space-y-3">
              {requestedSongs.map((song, index) => (
                <div
                  key={song.id}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragEnd={() => setDraggedIndex(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className={`rounded-2xl border p-4 transition ${
                    draggedIndex === index
                      ? "border-amber-600 bg-amber-950/30 opacity-60"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-950/50 text-sm font-bold text-amber-300">
                      {index + 1}
                    </div>

                    <span
                      className="cursor-grab pt-1 text-xl text-zinc-600 active:cursor-grabbing"
                      title="Déplacer la demande"
                    >
                      ☰
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xl font-semibold">
                        {song.title}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                        <span>{song.duration}</span>

                        {song.kind === "instrumental" && (
                          <span>🎹 Instrumental</span>
                        )}

                        {song.bpm && (
                          <span>♩ {song.bpm} BPM</span>
                        )}

                        {song.key && (
                          <span>{song.key}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="flex h-8 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-sm disabled:opacity-20"
                        aria-label="Monter la demande"
                      >
                        ▲
                      </button>

                      <button
                        type="button"
                        onClick={() => moveDown(index)}
                        disabled={index === requestedSongs.length - 1}
                        className="flex h-8 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-sm disabled:opacity-20"
                        aria-label="Descendre la demande"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onPlayNow(song.id)}
                      className="rounded-xl bg-emerald-500 px-4 py-3 font-bold text-zinc-950"
                    >
                      ▶ Jouer maintenant
                    </button>

                    <button
                      type="button"
                      onClick={() => onPlayNext(song.id)}
                      className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-semibold transition hover:border-emerald-500 hover:text-emerald-300"
                    >
                      Jouer ensuite
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveRequest(song.id)}
                      className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 font-semibold text-red-300"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-5xl">
                🙋
              </p>

              <p className="mt-4 text-xl font-semibold text-zinc-300">
                Aucune demande en attente
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Les demandes ajoutées depuis la Bibliothèque apparaîtront ici.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-800 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}