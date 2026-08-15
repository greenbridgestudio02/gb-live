"use client";

import { useState } from "react";

import SongList from "./components/SongList";
import { show } from "../data/show";
import SongSearch from "./components/SongSearch";
import FavoritesPanel from "./components/FavoritesPanel";

export default function Home() {
  const [setlistPosition, setSetlistPosition] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isIntermission, setIsIntermission] = useState(false);
  const [intermissionCount, setIntermissionCount] = useState(0);
  const [isSetlistOpen, setIsSetlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentSong = show.songs[currentSongIndex];
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const [favoriteSongIds] = useState([
    "mon-amour",
    "le-pont",
    "final",
]);

  function goToPreviousSong() {
  const previousPosition = Math.max(setlistPosition - 1, 0);

  setSetlistPosition(previousPosition);
  setCurrentSongIndex(previousPosition);
}

function goToNextSong() {
  const nextPosition = Math.min(
    setlistPosition + 1,
    show.songs.length - 1
  );

  setSetlistPosition(nextPosition);
  setCurrentSongIndex(nextPosition);
}

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            GreenBridge Live
          </p>

          <h1 className="mt-1 text-xl font-semibold">
            {show.title}
          </h1>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">
            Morceau
          </p>

          <p className="text-lg font-semibold">
            {currentSongIndex + 1} / {show.songs.length}
          </p>
        </div>
      </header>

      <section className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Morceau en cours
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {currentSong.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsPaused(true)}
            className="rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-red-500"
          >
            STOP
          </button>
        </div>

        <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
          <div className="whitespace-pre-line text-3xl font-medium leading-relaxed text-zinc-100">
            {currentSong.lyrics}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-3">
          <button
            type="button"
            onClick={goToPreviousSong}
            disabled={setlistPosition === 0}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold disabled:opacity-30"
          >
            ◀ Précédent
          </button>

          <button
            type="button"
            onClick={goToNextSong}
            disabled={setlistPosition === show.songs.length - 1}
            className="rounded-xl bg-emerald-500 px-4 py-4 font-bold text-zinc-950 disabled:opacity-30"
          >
            Suivant ▶
          </button>

          <button
            type="button"
            onClick={() => setIsSetlistOpen(true)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold"
          >
            Setlist
          </button>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold"
          >
            Rechercher
          </button>

          <button
            type="button"
            onClick={() => setIsFavoritesOpen(true)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold"
>
            Favoris
          </button>

          
        </div>
      </section>

      {isSetlistOpen && (
  <SongList
    songs={show.songs}
    currentSongIndex={currentSongIndex}
    onSelectSong={(index) => {
      setCurrentSongIndex(index);
    }}
    onClose={() => setIsSetlistOpen(false)}
  />
)}
{isSearchOpen && (
  <SongSearch
    songs={show.songs}
    onSelectSong={(index) => {
      setCurrentSongIndex(index);
    }}
    onClose={() => setIsSearchOpen(false)}
  />
)}

{isFavoritesOpen && (
  <FavoritesPanel
    songs={show.songs}
    favoriteSongIds={favoriteSongIds}
    onSelectSong={(index) => {
      setCurrentSongIndex(index);
    }}
    onClose={() => setIsFavoritesOpen(false)}
  />
)}

{isIntermission && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6">
    <div className="w-full max-w-3xl rounded-3xl border border-amber-800 bg-zinc-950 p-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          Entracte {intermissionCount}
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Spectacle en pause
        </h2>

        <p className="mt-4 text-zinc-400">
          Le déroulement du spectacle est conservé.
          Vous pouvez préparer librement la reprise.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Morceau actuellement préparé
        </p>

        <p className="mt-2 text-2xl font-bold">
          {currentSong.title}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setIsIntermission(false)}
          className="rounded-xl bg-emerald-500 px-6 py-5 text-lg font-bold text-zinc-950"
        >
          ▶ Reprendre le spectacle
        </button>

        <button
          type="button"
          onClick={() => {
            setIsIntermission(false);
            setIsSetlistOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-lg font-semibold"
        >
          Choisir le morceau de reprise
        </button>

        <button
          type="button"
          onClick={() => {
            setIsIntermission(false);
            setIsSearchOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-lg font-semibold"
        >
          Rechercher
        </button>

        <button
          type="button"
          onClick={() => {
            setIsIntermission(false);
            setIsFavoritesOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-lg font-semibold"
        >
          Favoris
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Les demandes du public pourront continuer à être reçues pendant l’entracte.
      </p>
    </div>
  </div>
)}

      {isPaused && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
    <div className="w-full max-w-2xl rounded-3xl border border-zinc-700 bg-zinc-900 p-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
          Spectacle interrompu
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          {currentSong.title}
        </h2>

        <p className="mt-4 text-zinc-400">
          GreenBridge Live a conservé le morceau courant et la position du spectacle.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setIsPaused(false)}
          className="rounded-xl bg-emerald-500 px-6 py-5 text-lg font-bold text-zinc-950"
        >
          ▶ Reprendre
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPaused(false);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-6 py-5 text-lg font-semibold"
        >
          ↺ Recommencer
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPaused(false);
            setIsSetlistOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-6 py-5 text-lg font-semibold"
        >
          Choisir un autre titre
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPaused(false);
            setIsIntermission(true);
            setIntermissionCount((count) => count + 1);
          }}
          className="rounded-xl border border-amber-700 bg-amber-950/40 px-6 py-5 text-lg font-semibold text-amber-300"
        >
          Entracte
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Aucune décision n’est imposée. Vous pouvez reprendre quand vous le souhaitez.
      </p>
    </div>
  </div>
)}

    </main>
  );
}