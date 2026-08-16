"use client";

import { useMemo, useState } from "react";
import type { Song } from "../../types/show";

type SongSearchProps = {
  songs: Song[];
  setlistSongIds: string[];
  onPlayNow: (index: number) => void;
  onPlayNext: (songId: string) => void;
  onAddToSetlist: (songId: string) => void;
  onClose: () => void;
};

export default function SongSearch({
  songs,
  setlistSongIds,
  onPlayNow,
  onPlayNext,
  onAddToSetlist,
  onClose,
}: SongSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return songs.map((song, index) => ({ song, index }));
    }

    return songs
      .map((song, index) => ({ song, index }))
      .filter(({ song }) =>
        song.title.toLowerCase().includes(normalizedQuery)
      );
  }, [query, songs]);

  function playNow(index: number) {
    onPlayNow(index);
    onClose();
  }

  function playNext(songId: string) {
    onPlayNext(songId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/80 p-6 pt-12">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              G3 Live
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Bibliothèque
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {songs.length} morceau{songs.length > 1 ? "x" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold transition hover:bg-zinc-800"
            aria-label="Fermer la bibliothèque"
          >
            ×
          </button>
        </div>

        <div className="p-5">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un morceau..."
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-xl text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
          />
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-5 pb-5">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map(({ song, index }) => {
                const isInSetlist = setlistSongIds.includes(song.id);

                return (
                  <div
                    key={song.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 text-sm font-semibold text-zinc-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-semibold">
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

                      {isInSetlist ? (
                        <span className="rounded-lg border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-xs font-semibold text-emerald-300">
                          ✓ Dans la setlist
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToSetlist(song.id)}
                          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold transition hover:border-emerald-500 hover:text-emerald-300"
                        >
                          + Ajouter
                        </button>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => playNow(index)}
                        className="rounded-lg bg-emerald-500 px-4 py-3 font-bold text-zinc-950"
                      >
                        ▶ Jouer maintenant
                      </button>

                      <button
                        type="button"
                        onClick={() => playNext(song.id)}
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-semibold transition hover:border-emerald-500 hover:text-emerald-300"
                      >
                        Jouer ensuite
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-zinc-500">
              Aucun morceau trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}