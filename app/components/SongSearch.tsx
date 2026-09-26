"use client";

import { useMemo, useState } from "react";
import type { Song } from "../../types/show";

type SongSearchProps = {
  songs: Song[];
  setlistSongIds: string[];
  requestedSongIds: string[];
  onPlayNow: (index: number) => void;
  onPlayNext: (songId: string) => void;
  onAddToSetlist: (songId: string) => void;
  onRequestSong: (songId: string) => void;
  onEditSong: (index: number) => void;
  onSyncSong: (index: number) => void;
  onDeleteSong: (songId: string) => void;
  onClose: () => void;
};

export default function SongSearch({
  songs,
  setlistSongIds,
  requestedSongIds,
  onPlayNow,
  onPlayNext,
  onAddToSetlist,
  onRequestSong,
  onEditSong,
  onSyncSong,
  onDeleteSong,
  onClose,
}: SongSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return songs.map((song, index) => ({
        song,
        index,
      }));
    }

    return songs
      .map((song, index) => ({
        song,
        index,
      }))
      .filter(({ song }) =>
        song.title
          .toLowerCase()
          .includes(normalizedQuery)
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
      <div className="w-full max-w-[1500px] overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950 shadow-2xl">

        {/* EN-TÊTE */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              G3 Live
            </p>

            <h2 className="mt-1 text-3xl font-black">
              Bibliothèque
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {songs.length} morceau
              {songs.length > 1 ? "x" : ""}
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

        {/* RECHERCHE */}
        <div className="p-5">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Rechercher un morceau..."
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-xl text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
          />
        </div>

        {/* LISTE */}
                <div className="max-h-[65vh] overflow-auto px-5 pb-5">
          {results.length > 0 ? (
            <div className="w-full overflow-hidden rounded-xl border border-zinc-800">

              {/* EN-TÊTE DU TABLEAU */}
              <div className="grid grid-cols-[45px_minmax(220px,1fr)_75px_105px_75px_90px_115px_125px_430px] items-center gap-2 border-b border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                <span>#</span>
                <span>Morceau</span>
                <span>Durée</span>
                <span>Type</span>
                <span>BPM</span>
                <span>Tonalité</span>
                <span>Paroles</span>
                <span>Setlist</span>
                <span>Actions</span>
              </div>

              {results.map(({ song, index }) => {
                const isInSetlist =
                  setlistSongIds.includes(song.id);

                const isRequested =
                  requestedSongIds.includes(song.id);

                const needsSync =
                  song.kind !== "instrumental" &&
                  (song.needsLyricsSync === true ||
                    !song.lyricLines ||
                    song.lyricLines.length === 0);

                return (
                  <div
                    key={song.id}
                    className="grid grid-cols-[45px_minmax(220px,1fr)_75px_105px_75px_90px_115px_125px_430px] items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-3 py-2 text-sm last:border-b-0 hover:bg-zinc-900"
                  >
                    {/* NUMÉRO */}
                    <span className="font-semibold text-zinc-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* TITRE */}
                    <span
                      className="truncate font-bold text-white"
                      title={song.title}
                    >
                      {song.title}
                    </span>

                    {/* DURÉE */}
                    <span className="text-zinc-400">
                      {song.duration}
                    </span>

                    {/* TYPE */}
                    <span className="text-zinc-400">
                      {song.kind === "instrumental"
                        ? "🎹 Instrumental"
                        : "Vocal"}
                    </span>

                    {/* BPM */}
                    <span className="text-zinc-400">
                      {song.bpm ? `${song.bpm}` : "—"}
                    </span>

                    {/* TONALITÉ */}
                    <span className="text-zinc-400">
                      {song.key || "—"}
                    </span>

                    {/* PAROLES */}
                    <span>
                      {song.kind === "instrumental" ? (
                        <span className="text-zinc-600">
                          —
                        </span>
                      ) : needsSync ? (
                        <span className="font-semibold text-amber-300">
                          ⚠ À synchroniser
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-300">
                          ✓ Synchronisé
                        </span>
                      )}
                    </span>

                    {/* SETLIST */}
                    <span>
                      {isInSetlist ? (
                        <span className="font-semibold text-emerald-300">
                          ✓ Dans la setlist
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            onAddToSetlist(song.id)
                          }
                          className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-semibold transition hover:border-emerald-500 hover:text-emerald-300"
                        >
                          + Ajouter
                        </button>
                      )}
                    </span>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-1">

                      <button
                        type="button"
                        onClick={() => onEditSong(index)}
                        className="rounded-md border border-sky-800 bg-sky-950/20 px-2 py-1 text-xs font-semibold text-sky-300 transition hover:bg-sky-950/50"
                        title="Modifier le morceau"
                      >
                        Modifier
                      </button>

                      {song.kind !== "instrumental" ? (
  <button
    type="button"
    onClick={() => onSyncSong(index)}
    className="w-[74px] rounded-md border border-violet-700 bg-violet-950/30 px-2 py-1 text-xs font-semibold text-violet-300 transition hover:bg-violet-950/60"
    title="Synchroniser les paroles"
  >
    Synchro
  </button>
) : (
  <span className="w-[74px]" />
)}

                      <button
                        type="button"
                        onClick={() => playNow(index)}
                        className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-bold text-zinc-950"
                        title="Jouer maintenant"
                      >
                        ▶ Jouer
                      </button>

                      <button
                        type="button"
                        onClick={() => playNext(song.id)}
                        className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-semibold transition hover:border-emerald-500 hover:text-emerald-300"
                        title="Jouer ensuite"
                      >
                        Ensuite
                      </button>

                      <button
                        type="button"
                        onClick={() => onRequestSong(song.id)}
                        disabled={isRequested}
                        className="rounded-md border border-amber-700 bg-amber-950/30 px-2 py-1 text-xs font-semibold text-amber-300 transition hover:bg-amber-950/60 disabled:cursor-not-allowed disabled:opacity-40"
                        title={
                          isRequested
                            ? "Demande déjà enregistrée"
                            : "Demande du public"
                        }
                      >
                        {isRequested ? "✓ Demandé" : "🙋 Demande"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Supprimer définitivement "${song.title}" de la bibliothèque ?`
                          );

                          if (!confirmed) {
                            return;
                          }

                          onDeleteSong(song.id);
                        }}
                        className="rounded-md border border-red-800 bg-red-950/30 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-950/60"
                        title="Supprimer définitivement"
                      >
                        🗑
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