"use client";

import { useEffect, useState } from "react";

import SongList from "./components/SongList";
import { show } from "../data/show";
import SongSearch from "./components/SongSearch";
import FavoritesPanel from "./components/FavoritesPanel";
import LyricsPlayer from "./components/LyricsPlayer";
import LyricsSyncEditor from "./components/LyricsSyncEditor";
import LyricsEditor from "./components/LyricsEditor";
import NewSongEditor from "./components/NewSongEditor";

export default function Home() {
  const [setlistPosition, setSetlistPosition] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [preparedSongIndex, setPreparedSongIndex] = useState<number | null>(null);


  const [isPaused, setIsPaused] = useState(false);
  const [isIntermission, setIsIntermission] = useState(false);
  const [intermissionCount, setIntermissionCount] = useState(0);

  const [isSetlistOpen, setIsSetlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSyncEditorOpen, setIsSyncEditorOpen] = useState(false);

  const [isPreparingIntermissionSong, setIsPreparingIntermissionSong] =
    useState(false);

  const [songs, setSongs] = useState(show.songs);
  const [setlistSongIds, setSetlistSongIds] = useState<string[]>(
  show.songs.map((song) => song.id)
);
  const [setlistLoaded, setSetlistLoaded] = useState(false);

useEffect(() => {
  const savedSetlist = localStorage.getItem("gb-live-setlist");

  if (savedSetlist) {
    try {
      setSetlistSongIds(JSON.parse(savedSetlist));
    } catch {
      console.error("Impossible de charger la setlist sauvegardée.");
    }
  }

  setSetlistLoaded(true);
}, []);

useEffect(() => {
  if (!setlistLoaded) {
    return;
  }

  localStorage.setItem(
    "gb-live-setlist",
    JSON.stringify(setlistSongIds)
  );
}, [setlistSongIds, setlistLoaded]);

  const setlistSongs = setlistSongIds
  .map((songId) => songs.find((song) => song.id === songId))
  .filter(
    (song): song is (typeof songs)[number] =>
      song !== undefined
  );

  const [songsLoaded, setSongsLoaded] = useState(false);
  const [isLyricsEditorOpen, setIsLyricsEditorOpen] = useState(false);
  const [isNewSongEditorOpen, setIsNewSongEditorOpen] = useState(false);

useEffect(() => {
  const savedSongs = localStorage.getItem("gb-live-songs");

  if (savedSongs) {
    try {
      setSongs(JSON.parse(savedSongs));
    } catch {
      console.error(
        "Impossible de charger les synchronisations sauvegardées."
      );
    }
  }

  setSongsLoaded(true);
}, []);

useEffect(() => {
  if (!songsLoaded) {
    return;
  }

  localStorage.setItem("gb-live-songs", JSON.stringify(songs));
}, [songs, songsLoaded]);

const [favoriteSongIds] = useState([
  "mon-amour",
  "le-pont",
  "final",
]);

const currentSong = songs[currentSongIndex];

  const preparedSong =
    preparedSongIndex !== null ? songs[preparedSongIndex] : null;

  function goToPreviousSong() {
  const previousPosition = Math.max(setlistPosition - 1, 0);
  const previousSongId = setlistSongIds[previousPosition];

  const previousSongIndex = songs.findIndex(
    (song) => song.id === previousSongId
  );

  setSetlistPosition(previousPosition);

  if (previousSongIndex !== -1) {
    setCurrentSongIndex(previousSongIndex);
  }
}

function goToNextSong() {
  const nextPosition = Math.min(
    setlistPosition + 1,
    setlistSongIds.length - 1
  );

  const nextSongId = setlistSongIds[nextPosition];

  const nextSongIndex = songs.findIndex(
    (song) => song.id === nextSongId
  );

  setSetlistPosition(nextPosition);

  if (nextSongIndex !== -1) {
    setCurrentSongIndex(nextSongIndex);
  }
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
            {currentSongIndex + 1} / {songs.length}
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

        <div className="flex-1">
          <LyricsPlayer song={currentSong} />
          {currentSong.needsLyricsSync && (
  <div className="mb-4 rounded-xl border border-amber-700 bg-amber-950/40 px-5 py-3 text-amber-300">
    ⚠ Synchronisation des paroles à refaire
  </div>
)}
          </div>

        <div className="mt-5 grid grid-cols-8 gap-3">
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
            disabled={setlistPosition === setlistSongIds.length - 1}
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
            Bibliothèque
          </button>

          <button
            type="button"
            onClick={() => setIsFavoritesOpen(true)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold"
>
            Favoris
          </button>

          <button
            type="button"
            onClick={() => setIsNewSongEditorOpen(true)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold"
            >
            Nouveau morceau
          </button>

          <button
            type="button"
            onClick={() => setIsLyricsEditorOpen(true)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold"
            >
            Éditer paroles
          </button>

          <button
            type="button"
            onClick={() => setIsSyncEditorOpen(true)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 font-semibold"
>
              Sync
            </button>
          
        </div>
      </section>

  {isSetlistOpen && (
  <SongList
    songs={setlistSongs}
    setlistPosition={setlistPosition}
    currentSongId={currentSong.id}
    onSelectSong={(setlistIndex) => {
      const selectedSong = setlistSongs[setlistIndex];

      if (!selectedSong) {
        return;
      }

      const libraryIndex = songs.findIndex(
        (song) => song.id === selectedSong.id
      );

      if (libraryIndex === -1) {
        return;
      }

      if (isPreparingIntermissionSong) {
        setPreparedSongIndex(libraryIndex);
        setIsPreparingIntermissionSong(false);
      } else {
        setCurrentSongIndex(libraryIndex);
        setSetlistPosition(setlistIndex);
      }
    }}
    onMoveSong={(fromIndex, toIndex) => {
      setSetlistSongIds((currentSetlist) => {
        const newSetlist = [...currentSetlist];

        const [movedSongId] = newSetlist.splice(fromIndex, 1);
        newSetlist.splice(toIndex, 0, movedSongId);

        const referenceSongId = currentSetlist[setlistPosition];
        const newPosition = newSetlist.indexOf(referenceSongId);

        if (newPosition !== -1) {
          setSetlistPosition(newPosition);
        }

        return newSetlist;
      });
    }}
onRemoveSong={(indexToRemove) => {
  setSetlistSongIds((currentSetlist) => {
    if (indexToRemove === setlistPosition) {
      return currentSetlist;
    }

    const newSetlist = currentSetlist.filter(
      (_, index) => index !== indexToRemove
    );

    if (indexToRemove < setlistPosition) {
      setSetlistPosition((position) =>
        Math.max(position - 1, 0)
      );
    }

    return newSetlist;
  });
}}

    onClose={() => setIsSetlistOpen(false)}
  />
)}

{isSearchOpen && (
  <SongSearch
    songs={songs}
    setlistSongIds={setlistSongIds}
    onSelectSong={(index) => {
      if (isPreparingIntermissionSong) {
        setPreparedSongIndex(index);
        setIsPreparingIntermissionSong(false);
      } else {
        setCurrentSongIndex(index);
      }
    }}
    onAddToSetlist={(songId) => {
      setSetlistSongIds((currentSetlist) => {
        if (currentSetlist.includes(songId)) {
          return currentSetlist;
        }

        return [...currentSetlist, songId];
      });
    }}
    onClose={() => setIsSearchOpen(false)}
  />
)}

{isFavoritesOpen && (
  <FavoritesPanel
    songs={songs}
    favoriteSongIds={favoriteSongIds}
    onSelectSong={(index) => {
      if (isPreparingIntermissionSong) {
        setPreparedSongIndex(index);
        setIsPreparingIntermissionSong(false);
      } else {
        setCurrentSongIndex(index);
      }
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
          {preparedSong ? preparedSong.title : currentSong.title}
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          {preparedSong
            ? "Ce morceau est préparé pour la reprise."
            : "Aucun autre morceau n’a été préparé."}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            if (preparedSongIndex !== null) {
              setCurrentSongIndex(preparedSongIndex);
              setPreparedSongIndex(null);
            }
            setIsPreparingIntermissionSong(false);
            setIsIntermission(false);
          }}  
          className="rounded-xl bg-emerald-500 px-6 py-5 text-lg font-bold text-zinc-950"
        >
          ▶ Reprendre le spectacle
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPreparingIntermissionSong(true);
            setIsSetlistOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-lg font-semibold"
        >
          Choisir le morceau de reprise
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPreparingIntermissionSong(true);
            setIsSearchOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-lg font-semibold"
        >
          Bibliothèque
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPreparingIntermissionSong(true);
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

{isNewSongEditorOpen && (
  <NewSongEditor
    onClose={() => setIsNewSongEditorOpen(false)}
    onSave={(newSong) => {
      setSongs((currentSongs) => [...currentSongs, newSong]);

      setCurrentSongIndex(songs.length);
      setIsNewSongEditorOpen(false);
    }}
  />
)}

{isLyricsEditorOpen && (
  <LyricsEditor
    song={currentSong}
    onClose={() => setIsLyricsEditorOpen(false)}
    onSave={(lines) => {
      setSongs((currentSongs) =>
        currentSongs.map((song, index) => {
          if (index !== currentSongIndex) {
            return song;
          }

          return {
            ...song,
            lyrics: lines.join("\n\n"),
            lyricLines: lines.map((text, lineIndex) => ({
              text,
              time: song.lyricLines?.[lineIndex]?.time ?? 0,
            })),
            needsLyricsSync: true,
          };
        })
      );

      setIsLyricsEditorOpen(false);
    }}
  />
)}

{isSyncEditorOpen && (
  <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/90 p-6">
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setIsSyncEditorOpen(false)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold"
        >
          Fermer
        </button>
      </div>

      <LyricsSyncEditor
        song={currentSong}
        onValidate={(times) => {
          setSongs((currentSongs) =>
            currentSongs.map((song, index) => {
              if (index !== currentSongIndex || !song.lyricLines) {
                 return song;
            }

            return {
              ...song,
              lyricLines: song.lyricLines.map((line, lineIndex) => ({
                ...line,
                time: times[lineIndex],
              })),
              needsLyricsSync: false,
           };
         })
      );

     setIsSyncEditorOpen(false);
  }}
/>
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