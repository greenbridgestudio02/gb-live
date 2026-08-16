"use client";

import { useMemo, useState } from "react";
import type { Song } from "../../types/show";

type LyricsEditorProps = {
  song: Song;
  onSave: (lines: string[]) => void;
  onClose: () => void;
};

export default function LyricsEditor({
  song,
  onSave,
  onClose,
}: LyricsEditorProps) {
  const [lyricsText, setLyricsText] = useState(song.lyrics);

  const lines = useMemo(() => {
    return lyricsText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [lyricsText]);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/90 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Éditeur de paroles
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {song.title}
            </h2>

            <p className="mt-2 text-zinc-500">
              Collez ou modifiez les paroles, puis vérifiez le découpage en phrases.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Paroles
            </p>

            <textarea
              value={lyricsText}
              onChange={(event) => setLyricsText(event.target.value)}
              className="min-h-[520px] w-full resize-y rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-lg leading-relaxed outline-none focus:border-emerald-500"
              placeholder="Collez les paroles ici..."
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Découpage en phrases
              </p>

              <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm text-zinc-400">
                {lines.length} phrases
              </span>
            </div>

            <div className="max-h-[520px] space-y-2 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              {lines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <span className="w-8 text-sm font-semibold text-zinc-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="flex-1 text-lg">
                    {line}
                  </p>
                </div>
              ))}

              {lines.length === 0 && (
                <p className="py-10 text-center text-zinc-600">
                  Aucune phrase.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={() => onSave(lines)}
            disabled={lines.length === 0}
            className="rounded-xl bg-emerald-500 px-6 py-4 font-bold text-zinc-950 disabled:opacity-30"
          >
            Enregistrer les paroles
          </button>
        </div>
      </div>
    </div>
  );
}