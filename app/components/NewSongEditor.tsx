"use client";

import { useMemo, useState } from "react";
import type { Song, SongKind } from "../../types/show";

type NewSongEditorProps = {
  onSave: (song: Song) => void;
  onClose: () => void;
};

export default function NewSongEditor({
  onSave,
  onClose,
}: NewSongEditorProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [stageNotes, setStageNotes] = useState("");
  const [lyricsText, setLyricsText] = useState("");
  const [kind, setKind] = useState<SongKind>("vocal");

  const lines = useMemo(() => {
    return lyricsText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [lyricsText]);

  const isVocal = kind === "vocal";

  function createSong() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    if (isVocal && lines.length === 0) {
      return;
    }

    const id =
      trimmedTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `morceau-${Date.now()}`;

    const newSong: Song = {
      id,
      title: trimmedTitle,
      duration: duration.trim() || "--:--",
      description:
        description.trim() ||
        (isVocal ? "Morceau chanté" : "Morceau instrumental"),
      stageNotes: stageNotes.trim(),
      nextAction: "",
      kind,

      lyrics: isVocal ? lines.join("\n\n") : "",

      lyricLines: isVocal
        ? lines.map((text) => ({
            text,
            time: 0,
          }))
        : [],

      needsLyricsSync: isVocal,
    };

    onSave(newSong);
  }

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/90 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              G3 Live
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Nouveau morceau
            </h2>

            <p className="mt-2 text-zinc-500">
              Créez un morceau chanté ou instrumental.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Type de morceau
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setKind("vocal")}
              className={`rounded-2xl border px-6 py-5 text-left transition ${
                kind === "vocal"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-zinc-700 bg-zinc-900"
              }`}
            >
              <span className="block text-xl font-bold">
                🎤 Chanté
              </span>

              <span className="mt-1 block text-sm text-zinc-500">
                Paroles et synchronisation par phrases
              </span>
            </button>

            <button
              type="button"
              onClick={() => setKind("instrumental")}
              className={`rounded-2xl border px-6 py-5 text-left transition ${
                kind === "instrumental"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-zinc-700 bg-zinc-900"
              }`}
            >
              <span className="block text-xl font-bold">
                🎹 Instrumental
              </span>

              <span className="mt-1 block text-sm text-zinc-500">
                Aucun système de paroles nécessaire
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-400">
                Titre *
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Titre du morceau"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-400">
                Durée
              </label>

              <input
                type="text"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                placeholder="Ex. 04:15"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-400">
                Description
              </label>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={
                  isVocal
                    ? "Ex. Ballade, morceau d'ouverture..."
                    : "Ex. Instrumental piano, medley..."
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-400">
                Notes de scène
              </label>

              <textarea
                value={stageNotes}
                onChange={(event) => setStageNotes(event.target.value)}
                placeholder={
                  isVocal
                    ? "Notes personnelles..."
                    : "Ex. intro libre, solo, reprise au signe..."
                }
                className="min-h-28 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            {isVocal ? (
              <>
                <label className="mb-2 block text-sm font-semibold text-zinc-400">
                  Paroles *
                </label>

                <textarea
                  value={lyricsText}
                  onChange={(event) => setLyricsText(event.target.value)}
                  placeholder="Collez les paroles ici, une phrase par ligne..."
                  className="min-h-[390px] w-full resize-y rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-lg leading-relaxed outline-none focus:border-emerald-500"
                />

                <p className="mt-3 text-sm text-zinc-500">
                  {lines.length} phrase{lines.length > 1 ? "s" : ""} détectée
                  {lines.length > 1 ? "s" : ""}.
                </p>
              </>
            ) : (
              <div className="flex min-h-[390px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
                <div>
                  <p className="text-5xl">
                    🎹
                  </p>

                  <h3 className="mt-4 text-2xl font-bold">
                    Morceau instrumental
                  </h3>

                  <p className="mt-3 max-w-sm text-zinc-500">
                    Aucune parole ni synchronisation ne sera créée.
                    Les notes de scène pourront servir de repères pendant
                    la prestation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-500">
            {isVocal
              ? "Le morceau devra être synchronisé avant son utilisation en live."
              : "Le morceau sera immédiatement utilisable comme instrumental."}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={createSong}
              disabled={!title.trim() || (isVocal && lines.length === 0)}
              className="rounded-xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Créer le morceau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}