"use client";

import { useState } from "react";

type AirGuitarPanelProps = {
  onClose: () => void;
  onShowTuto: () => void;
  onStartChallenge: () => void;
  onPlayerReady: (audioFile: string) => void;
  onChallenge: (challenge: string) => void;
  onFinale: () => void;
  onApplause: () => void;
  onScore: (score: "rocker" | "guitar-hero" | "legende") => void;
  onNextPlayer: () => void;
};

export default function AirGuitarPanel({
  onClose,
  onShowTuto,
  onStartChallenge,
  onPlayerReady,
  onChallenge,
  onFinale,
  onApplause,
  onScore,
  onNextPlayer,
}: AirGuitarPanelProps) {
  const [started, setStarted] = useState(false);
  const airGuitarSongs = [
  {
    id: "back-in-black",
    title: "Back In Black",
    artist: "AC/DC",
    file: "/audio/air-guitar/air-guitar-ACDC-Back-In-Black.mp3",
  },
  {
    id: "highway-to-hell",
    title: "Highway to Hell",
    artist: "AC/DC",
    file: "/audio/air-guitar/air-guitar-ACDC-Highway-to-Hell.mp3",
  },
  {
    id: "thunderstruck",
    title: "Thunderstruck",
    artist: "AC/DC",
    file: "/audio/air-guitar/air-guitar-ACDC-Thunderstruck.mp3",
  },
  {
    id: "smells-like-teen-spirit",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    file: "/audio/air-guitar/air-guitar-Nirvana-Smells-Like-Teen-Spirit.mp3",
  },
  {
    id: "black-betty",
    title: "Black Betty",
    artist: "Ram Jam",
    file: "/audio/air-guitar/air-guitar-RamJam-Black-Betty.mp3",
  },
];

const [selectedSong, setSelectedSong] = useState(airGuitarSongs[0].id);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-6">
      <div className="w-full max-w-4xl scale-[0.75] rounded-3xl border border-red-800 bg-zinc-950 p-4 text-zinc-100">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
              GB Live
            </p>

            <h2 className="mt-1 text-3xl font-black">
              🎸 Air Guitar
            </h2>

            <p className="mt-2 text-zinc-500">
              Fais monter un Guitar Hero sur scène.
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

        <div className="mt-8 grid grid-cols-2 gap-4">

          <button
            type="button"
            onClick={onShowTuto}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-xl font-bold hover:bg-zinc-800"
          >
            📺 VOIR LE TUTO
          </button>

          <button
            type="button"
            onClick={() => {
              setStarted(true);
              onStartChallenge();
            }}
            className="rounded-2xl bg-red-600 px-6 py-5 text-xl font-black text-white hover:bg-red-500"
          >
            🎸 LANCER LE DÉFI
          </button>

        </div>

        {started && (
          <>
          <div className="mb-4">
  <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
    🎵 Morceau Air Guitar
  </p>

  <div className="grid grid-cols-2 gap-2">
    {airGuitarSongs.map((song) => (
      <button
        key={song.id}
        type="button"
        onClick={() => setSelectedSong(song.id)}
        className={`rounded-xl border px-3 py-2 text-left transition ${
          selectedSong === song.id
            ? "border-red-500 bg-red-950/60 text-white"
            : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
        }`}
      >
        <span className="block text-lg font-black">
          {song.title}
        </span>

        <span className="text-sm font-bold text-zinc-400">
          {song.artist}
        </span>
      </button>
    ))}
  </div>
</div>
            <button
              type="button"
              onClick={() => {
  const song = airGuitarSongs.find((item) => item.id === selectedSong);

  if (song) {
    onPlayerReady(song.file);
  }
}}
              className="mt-4 w-full rounded-2xl bg-amber-500 px-6 py-5 text-2xl font-black text-zinc-950 hover:bg-amber-400"
            >
              🤘 JOUEUR PRÊT — 3 · 2 · 1 · ROCK !
            </button>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Défis surprise
              </p>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() => onChallenge("knees")}
                  className="rounded-2xl border border-orange-700 bg-orange-950/30 px-5 py-4 text-lg font-bold text-orange-300"
                >
                  🔥 SOLO À GENOUX !
                </button>

                <button
                  type="button"
                  onClick={() => onChallenge("behind-head")}
                  className="rounded-2xl border border-violet-700 bg-violet-950/30 px-5 py-4 text-lg font-bold text-violet-300"
                >
                  🤘 DERRIÈRE LA TÊTE !
                </button>

                <button
                  type="button"
                  onClick={() => onChallenge("crowd")}
                  className="rounded-2xl border border-cyan-700 bg-cyan-950/30 px-5 py-4 text-lg font-bold text-cyan-300"
                >
                  📣 FAIS CRIER LE PUBLIC !
                </button>

                <button
                  type="button"
                  onClick={() => onChallenge("crazy-solo")}
                  className="rounded-2xl border border-yellow-700 bg-yellow-950/30 px-5 py-4 text-lg font-bold text-yellow-300"
                >
                  ⚡ SOLO DE FOLIE !
                </button>

              </div>
            </div>

            <button
              type="button"
              onClick={onFinale}
              className="mt-6 w-full rounded-2xl bg-red-700 px-6 py-5 text-2xl font-black text-white hover:bg-red-600"
            >
              🏁 FINALE DE ROCK STAR !
            </button>

            <button
              type="button"
              onClick={onApplause}
              className="mt-4 w-full rounded-2xl border border-amber-500 bg-amber-950/30 px-6 py-5 text-2xl font-black text-amber-300"
            >
              👏 APPLAUDIMÈTRE !
            </button>

            <div className="mt-4 grid grid-cols-3 gap-3">

              <button
                type="button"
                onClick={() => onScore("rocker")}
                className="rounded-2xl border border-zinc-600 bg-zinc-900 px-4 py-5 text-base font-black"
              >
                🎸 ROCKER
              </button>

              <button
                type="button"
                onClick={() => onScore("guitar-hero")}
                className="rounded-2xl border border-orange-600 bg-orange-950/40 px-4 py-5 text-base font-black text-orange-300"
              >
                🔥 GUITAR HERO
              </button>

              <button
                type="button"
                onClick={() => onScore("legende")}
                className="rounded-2xl border border-yellow-500 bg-yellow-950/40 px-4 py-5 text-base font-black text-yellow-300"
              >
                👑 LÉGENDE DU ROCK
              </button>

            </div>

            <button
              type="button"
              onClick={onNextPlayer}
              className="mt-6 w-full rounded-2xl border border-emerald-700 bg-emerald-950/30 px-6 py-4 text-lg font-bold text-emerald-300"
            >
              ➜ JOUEUR SUIVANT
            </button>
          </>
        )}

      </div>
    </div>
  );
}