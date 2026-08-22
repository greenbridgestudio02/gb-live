"use client";

import { useMemo, useState } from "react";
import type { Song, SongKind } from "../../types/show";

type SongEditorProps = {
  song: Song;
  onSave: (song: Song) => void;
  onClose: () => void;
};

export default function SongEditor({
  song,
  onSave,
  onClose,
}: SongEditorProps) {
  const [title, setTitle] = useState(song.title);
  const [duration, setDuration] = useState(song.duration);
  const [description, setDescription] = useState(song.description);
  const [stageNotes, setStageNotes] = useState(song.stageNotes);
  const [lyricsText, setLyricsText] = useState(song.lyrics);
  const [kind, setKind] = useState<SongKind>(
    song.kind ?? "vocal"
  );
  const [bpm, setBpm] = useState(
    song.bpm ? String(song.bpm) : ""
  );
  const [keySignature, setKeySignature] = useState(
    song.key ?? ""
  );

const [montageEnabled, setMontageEnabled] = useState(
  song.montage?.enabled ?? false
);

const [montageBank, setMontageBank] = useState(
  String(song.montage?.liveSetBank ?? 1)
);

const [montagePage, setMontagePage] = useState(
  String(song.montage?.liveSetPage ?? 1)
);

const [montageSlot, setMontageSlot] = useState(
  String(song.montage?.liveSetSlot ?? 1)
);

  const lines = useMemo(() => {
    return lyricsText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [lyricsText]);

  const isVocal = kind === "vocal";

  function saveSong() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    if (isVocal && lines.length === 0) {
      return;
    }

    const parsedBpm = bpm.trim()
      ? Number.parseInt(bpm.trim(), 10)
      : undefined;

    const wasVocal = (song.kind ?? "vocal") === "vocal";

    const lyricsChanged =
      isVocal &&
      lines.join("\n\n") !== song.lyrics;

    const switchingToVocal =
      !wasVocal && isVocal;

    const updatedSong: Song = {
      ...song,
      title: trimmedTitle,
      duration: duration.trim() || "--:--",
      description:
        description.trim() ||
        (isVocal ? "Morceau chanté" : "Morceau instrumental"),
      stageNotes: stageNotes.trim(),
      kind,

      bpm:
        parsedBpm !== undefined && !Number.isNaN(parsedBpm)
          ? parsedBpm
          : undefined,

      key: keySignature.trim() || undefined,

      lyrics: isVocal ? lines.join("\n\n") : "",

      lyricLines: isVocal
        ? lines.map((text, lineIndex) => ({
            text,
            time:
              !lyricsChanged && !switchingToVocal
                ? song.lyricLines?.[lineIndex]?.time ?? 0
                : 0,
          }))
        : [],

      needsLyricsSync: isVocal
        ? lyricsChanged ||
          switchingToVocal ||
          song.needsLyricsSync === true
        : false,
    
        montage: montageEnabled
  ? {
      enabled: true,

      channel: 1,

      bankMsb: 62,

      bankLsb:
        Number.parseInt(montagePage, 10) - 1,

      program:
        Number.parseInt(montageSlot, 10) - 1,

      liveSetBank:
        Number.parseInt(montageBank, 10),

      liveSetPage:
        Number.parseInt(montagePage, 10),

      liveSetSlot:
        Number.parseInt(montageSlot, 10),
    }
  : undefined,
    };

    onSave(updatedSong);
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
              Modifier le morceau
            </h2>

            <p className="mt-2 text-zinc-500">
              Modifiez les informations du morceau et son type.
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
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-400">
                  Durée
                </label>

                <input
                  type="text"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="04:15"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-400">
                  BPM
                </label>

                <input
                  type="number"
                  min="1"
                  max="300"
                  value={bpm}
                  onChange={(event) => setBpm(event.target.value)}
                  placeholder="112"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-400">
                  Tonalité
                </label>

                <input
                  type="text"
                  value={keySignature}
                  onChange={(event) => setKeySignature(event.target.value)}
                  placeholder="Sol majeur"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-400">
                Description
              </label>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
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
                  placeholder="Une phrase par ligne..."
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
                  <p className="text-5xl">🎹</p>

                  <h3 className="mt-4 text-2xl font-bold">
                    Morceau instrumental
                  </h3>

                  <p className="mt-3 max-w-sm text-zinc-500">
                    Les paroles et la synchronisation ne seront pas utilisées.
                    Les notes de scène restent disponibles en Mode Scène.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-6">
          <p className="text-sm text-zinc-500">
            {isVocal
              ? "Toute modification des paroles peut nécessiter une nouvelle synchronisation."
              : "Le morceau sera utilisé directement en mode instrumental."}
          </p>

<div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900/60 p-5">
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
        MONTAGE M8x
      </p>

      <h3 className="mt-1 text-xl font-bold">
        Pilotage du Yamaha MONTAGE
      </h3>

      <p className="mt-1 text-sm text-zinc-500">
        Associe ce morceau à son emplacement dans le Live Set.
      </p>
    </div>

    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={montageEnabled}
        onChange={(event) =>
          setMontageEnabled(event.target.checked)
        }
        className="h-5 w-5 accent-emerald-500"
      />

      <span className="font-semibold">
        Piloter le M8x
      </span>
    </label>
  </div>

  {montageEnabled && (
    <div className="mt-5 grid grid-cols-3 gap-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-400">
          User Bank
        </label>

        <input
          type="number"
          min="1"
          max="8"
          value={montageBank}
          onChange={(event) =>
            setMontageBank(event.target.value)
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-400">
          Page
        </label>

        <input
          type="number"
          min="1"
          value={montagePage}
          onChange={(event) =>
            setMontagePage(event.target.value)
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-zinc-400">
          Slot
        </label>

        <input
          type="number"
          min="1"
          max="16"
          value={montageSlot}
          onChange={(event) =>
            setMontageSlot(event.target.value)
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  )}

  {montageEnabled && (
    <div className="mt-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 px-4 py-3">
      <p className="text-sm text-zinc-400">
        Le M8x sera préparé sur :
      </p>

      <p className="mt-1 font-bold text-emerald-400">
        User {montageBank} • Page {montagePage} • Slot {montageSlot}
      </p>
    </div>
  )}
</div>

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
              onClick={saveSong}
              disabled={!title.trim() || (isVocal && lines.length === 0)}
              className="rounded-xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}