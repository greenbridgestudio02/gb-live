"use client";

import type { Song } from "../../types/show";

type FavoritesPanelProps = {
  songs: Song[];
  favoriteSongIds: string[];
  onSelectSong: (index: number) => void;
  onClose: () => void;
};

export default function FavoritesPanel({
  songs,
  favoriteSongIds,
  onSelectSong,
  onClose,
}: FavoritesPanelProps) {
  const favorites = songs
    .map((song, index) => ({ song, index }))
    .filter(({ song }) => favoriteSongIds.includes(song.id));

  function selectSong(index: number) {
    onSelectSong(index);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/80 p-6 pt-20">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              GreenBridge Live
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Favoris
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold transition hover:bg-zinc-800"
            aria-label="Fermer les favoris"
          >
            ×
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          {favorites.length > 0 ? (
            <div className="space-y-2">
              {favorites.map(({ song, index }) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => selectSong(index)}
                  className="flex w-full items-center gap-4 rounded-xl border border-transparent bg-zinc-900 p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-500/10"
                >
                  <span className="text-xl text-amber-400">
                    ★
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
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500">
              Aucun favori pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}