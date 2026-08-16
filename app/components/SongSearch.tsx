"use client";

import { useMemo, useState } from "react";
import type { Song } from "../../types/show";

type SongSearchProps = {
  songs: Song[];
  setlistSongIds: string[];
  onSelectSong: (index: number) => void;
  onAddToSetlist: (songId: string) => void;
  onClose: () => void;
};

export default function SongSearch({
  songs,
  setlistSongIds,
  onSelectSong,
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

  function selectSong(index: number) {
    onSelectSong(index);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/80 p-6 pt-12">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              GreenBridge Live
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
                    className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                  >
                    <button
                      type="button"
                      onClick={() => selectSong(index)}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
                      <span className="w-8 text-sm font-semibold text-zinc-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-lg font-semibold">
                          {song.title}
                        </span>

                        <span className="mt-1 block text-xs text-zinc-500">
                          {song.duration}
                        </span>
                      </span>

                      <span className="text-sm font-semibold text-emerald-400">
                        Jouer
                      </span>
                    </button>

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