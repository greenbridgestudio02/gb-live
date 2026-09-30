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
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950 shadow-2xl">

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
        <div className="max-h-[65vh] overflow-y-auto px-5 pb-5">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map(
                ({ song, index }) => {
                  const isInSetlist =
                    setlistSongIds.includes(
                      song.id
                    );

                  const isRequested =
                    requestedSongIds.includes(
                      song.id
                    );

                  const needsSync =
                    song.kind !==
                      "instrumental" &&
                    (song.needsLyricsSync ===
                      true ||
                      !song.lyricLines ||
                      song.lyricLines.length ===
                        0);

                  return (
                    <div
                      key={song.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                    >
                      {/* IDENTITÉ DU MORCEAU */}
                      <div className="flex items-start gap-4">

                        <span className="mt-1 w-10 shrink-0 text-sm font-semibold text-zinc-600">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div className="min-w-0 flex-1">

                          {/* TITRE */}
                          <h3 className="truncate text-2xl font-black text-white">
                            {song.title}
                          </h3>

                          {/* INFOS */}
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">

                            <span>
                              {song.duration}
                            </span>

                            {song.kind ===
                              "instrumental" && (
                              <span>
                                🎹 Instrumental
                              </span>
                            )}

                            {song.bpm && (
                              <span>
                                ♩ {song.bpm} BPM
                              </span>
                            )}

                            {song.key && (
                              <span>
                                Tonalité :{" "}
                                {song.key}
                              </span>
                            )}

                          </div>

                          {/* ÉTATS */}
                          <div className="mt-3 flex flex-wrap gap-2">

                            {song.kind !==
                              "instrumental" &&
                              (needsSync ? (
                                <span className="rounded-lg border border-amber-800 bg-amber-950/30 px-3 py-2 text-xs font-semibold text-amber-300">
                                  ⚠️ À
                                  synchroniser
                                </span>
                              ) : (
                                <span className="rounded-lg border border-emerald-800 bg-emerald-950/30 px-3 py-2 text-xs font-semibold text-emerald-300">
                                  ✅ Synchronisé
                                </span>
                              ))}

                            {isRequested && (
                              <span className="rounded-lg border border-amber-700 bg-amber-950/40 px-3 py-2 text-xs font-semibold text-amber-300">
                                🙋 Demandé
                              </span>
                            )}

                            {isInSetlist ? (
                              <span className="rounded-lg border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-xs font-semibold text-emerald-300">
                                ✓ Dans la
                                setlist
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  onAddToSetlist(
                                    song.id
                                  )
                                }
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold transition hover:border-emerald-500 hover:text-emerald-300"
                              >
                                + Ajouter à la
                                setlist
                              </button>
                            )}

                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-6">

                        <button
                          type="button"
                          onClick={() =>
                            onEditSong(index)
                          }
                          className="rounded-lg border border-sky-800 bg-sky-950/20 px-4 py-2 font-semibold text-sky-300 transition hover:bg-sky-950/50"
                        >
                          ✏️ Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onSyncSong(index)
                          }
                          disabled={
                            song.kind ===
                            "instrumental"
                          }
                          className="rounded-lg border border-violet-700 bg-violet-950/30 px-4 py-2 font-semibold text-violet-300 transition hover:bg-violet-950/60 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          🎤 Synchroniser
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            playNow(index)
                          }
                          className="rounded-lg bg-emerald-500 px-4 py-2 font-bold text-zinc-950"
                        >
                          ▶ Jouer maintenant
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            playNext(song.id)
                          }
                          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 font-semibold transition hover:border-emerald-500 hover:text-emerald-300"
                        >
                          Jouer ensuite
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onRequestSong(
                              song.id
                            )
                          }
                          disabled={
                            isRequested
                          }
                          className="rounded-lg border border-amber-700 bg-amber-950/30 px-4 py-2 font-semibold text-amber-300 transition hover:bg-amber-950/60 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isRequested
                            ? "✓ Demande enregistrée"
                            : "🙋 Demande du public"}
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
  className="rounded-lg border border-red-800 bg-red-950/30 px-4 py-2 font-semibold text-red-300 transition hover:bg-red-950/60"
>
  🗑️ Supprimer
</button>

                      </div>
                    </div>
                  );
                }
              )}
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