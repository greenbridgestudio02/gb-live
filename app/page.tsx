"use client";

import { useEffect, useState } from "react";

import SongList from "./components/SongList";
import { show } from "../data/show";
import SongSearch from "./components/SongSearch";
import LyricsPlayer from "./components/LyricsPlayer";
import LyricsSyncEditor from "./components/LyricsSyncEditor";
import SongEditor from "./components/SongEditor";
import NewSongEditor from "./components/NewSongEditor";
import RequestsPanel from "./components/RequestsPanel";

export default function Home() {
  const [setlistPosition, setSetlistPosition] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [preparedSongIndex, setPreparedSongIndex] = useState<number | null>(null);


  const [isPaused, setIsPaused] = useState(false);
  const [isIntermission, setIsIntermission] = useState(false);
  const [intermissionCount, setIntermissionCount] = useState(0);

  const [isSetlistOpen, setIsSetlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [requestedSongIds, setRequestedSongIds] = useState<string[]>([]);
  const [requestsLoaded, setRequestsLoaded] = useState(false);
  const [isSyncEditorOpen, setIsSyncEditorOpen] = useState(false);

  const [isPreparingIntermissionSong, setIsPreparingIntermissionSong] =
    useState(false);

  const [songs, setSongs] = useState(show.songs);
  const [setlistSongIds, setSetlistSongIds] = useState<string[]>(
  show.songs.map((song) => song.id)
);
  const [setlistLoaded, setSetlistLoaded] = useState(false);
  const [isPreparationOpen, setIsPreparationOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);

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

  const nextSetlistSong =
  setlistPosition < setlistSongs.length - 1
    ? setlistSongs[setlistPosition + 1]
    : null;

  const [songsLoaded, setSongsLoaded] = useState(false);
  const [isSongEditorOpen, setIsSongEditorOpen] = useState(false);
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


useEffect(() => {
  const savedRequests = localStorage.getItem("g3-live-requests");

  if (savedRequests) {
    try {
      setRequestedSongIds(JSON.parse(savedRequests));
    } catch {
      console.error(
        "Impossible de charger les demandes du public sauvegardées."
      );
    }
  }

  setRequestsLoaded(true);
}, []);

useEffect(() => {
  if (!requestsLoaded) {
    return;
  }

  localStorage.setItem(
    "g3-live-requests",
    JSON.stringify(requestedSongIds)
  );
}, [requestedSongIds, requestsLoaded]);

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
    <main className="flex h-screen overflow-hidden flex-col bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-2">
        <div>
  <img
    src="/g3-live-logo.png"
    alt="G3 Live"
    className="h-20 w-auto object-contain object-left"
  />


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

      <section className="flex min-h-0 flex-1 flex-col px-4 py-2">
        <div className="mb-2 flex items-center justify-between">
          <div>
  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
    Morceau en cours
  </p>

  <div className="mt-2 flex flex-wrap items-end gap-x-5 gap-y-1">
    <h2 className="text-4xl font-bold">
      {currentSong.title}
    </h2>

    {(currentSong.bpm || currentSong.key) && (
      <div className="flex items-center gap-4 pb-1 text-sm font-semibold text-zinc-500">
        {currentSong.bpm && (
          <span>♩ {currentSong.bpm} BPM</span>
        )}

        {currentSong.key && (
          <span>Tonalité : {currentSong.key}</span>
        )}
      </div>
    )}
  </div>
</div>

          <button
            type="button"
            onClick={() => setIsPaused(true)}
            className="rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-red-500"
          >
            STOP
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
  <LyricsPlayer song={currentSong} />
          </div>
      <div className="mb-2 flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-4">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
      Prochain morceau
    </p>

    <p className="mt-1 text-xl font-bold text-zinc-100">
      {nextSetlistSong ? nextSetlistSong.title : "Fin de la setlist"}
    </p>
  </div>

  {nextSetlistSong && (
    <div className="text-right text-sm text-zinc-500">
      {nextSetlistSong.duration}
    </div>
  )}
</div>

<div className="mt-2 grid grid-cols-6 gap-3">
  <button
    type="button"
    onClick={goToPreviousSong}
    disabled={setlistPosition === 0}
    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold disabled:opacity-30"
  >
    ◀ Précédent
  </button>

  <button
    type="button"
    onClick={goToNextSong}
    disabled={setlistPosition === setlistSongIds.length - 1}
    className="rounded-xl bg-emerald-500 px-4 py-3 font-bold text-zinc-950 disabled:opacity-30"
  >
    Suivant ▶
  </button>

  <button
    type="button"
    onClick={() => setIsSetlistOpen(true)}
    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold"
  >
    Setlist
  </button>

  <button
    type="button"
    onClick={() => setIsSearchOpen(true)}
    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold"
  >
    Bibliothèque
  </button>

  <button
    type="button"
    onClick={() => setIsRequestsOpen(true)}
    className={`rounded-xl border px-4 py-3 font-semibold ${
      requestedSongIds.length > 0
        ? "border-amber-700 bg-amber-950/30 text-amber-300"
        : "border-zinc-700 bg-zinc-900"
    }`}
  >
    Demandes ({requestedSongIds.length})
  </button>

  <button
    type="button"
    onClick={() => setIsPreparationOpen(true)}
    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold"
  >
    Préparation
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
    requestedSongIds={requestedSongIds}
    onPlayNow={(index) => {
      if (isPreparingIntermissionSong) {
        setPreparedSongIndex(index);
        setIsPreparingIntermissionSong(false);
      } else {
        setCurrentSongIndex(index);

        const selectedSongId = songs[index]?.id;
        const setlistIndex = selectedSongId
          ? setlistSongIds.indexOf(selectedSongId)
          : -1;

        if (setlistIndex !== -1) {
          setSetlistPosition(setlistIndex);
        }
      }
    }}
    onPlayNext={(songId) => {
      setSetlistSongIds((currentSetlist) => {
        const withoutSong = currentSetlist.filter(
          (id) => id !== songId
        );

        const currentSongId =
          currentSetlist[setlistPosition];

        const currentPosition =
          withoutSong.indexOf(currentSongId);

        const insertPosition =
          currentPosition !== -1
            ? currentPosition + 1
            : Math.min(
                setlistPosition + 1,
                withoutSong.length
              );

        const newSetlist = [...withoutSong];

        newSetlist.splice(
          insertPosition,
          0,
          songId
        );

        return newSetlist;
      });
    }}
    onAddToSetlist={(songId) => {
      setSetlistSongIds((currentSetlist) => {
        if (currentSetlist.includes(songId)) {
          return currentSetlist;
        }

        return [...currentSetlist, songId];
      });
    }}
    onRequestSong={(songId) => {
  setRequestedSongIds((currentRequests) => {
    if (currentRequests.includes(songId)) {
      return currentRequests;
    }

    return [...currentRequests, songId];
  });
}}
    onClose={() => setIsSearchOpen(false)}
  />
)}

{isRequestsOpen && (
  <RequestsPanel
    songs={songs}
    requestedSongIds={requestedSongIds}
    onPlayNow={(songId) => {
      const libraryIndex = songs.findIndex(
        (song) => song.id === songId
      );

      if (libraryIndex === -1) {
        return;
      }

      setCurrentSongIndex(libraryIndex);

      const setlistIndex = setlistSongIds.indexOf(songId);

      if (setlistIndex !== -1) {
        setSetlistPosition(setlistIndex);
      }

      setRequestedSongIds((currentRequests) =>
        currentRequests.filter((id) => id !== songId)
      );

      setIsRequestsOpen(false);
    }}
    onPlayNext={(songId) => {
      setSetlistSongIds((currentSetlist) => {
        const currentSongId =
          currentSetlist[setlistPosition];

        const withoutSong = currentSetlist.filter(
          (id) => id !== songId
        );

        const currentPosition =
          withoutSong.indexOf(currentSongId);

        const insertPosition =
          currentPosition !== -1
            ? currentPosition + 1
            : Math.min(
                setlistPosition + 1,
                withoutSong.length
              );

        const newSetlist = [...withoutSong];

        newSetlist.splice(
          insertPosition,
          0,
          songId
        );

        return newSetlist;
      });

      setRequestedSongIds((currentRequests) =>
        currentRequests.filter((id) => id !== songId)
      );

      setIsRequestsOpen(false);
    }}
    onRemoveRequest={(songId) => {
      setRequestedSongIds((currentRequests) =>
        currentRequests.filter((id) => id !== songId)
      );
    }}
    onClose={() => setIsRequestsOpen(false)}
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

      <div className="mt-6 grid grid-cols-3 gap-4">
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
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Les demandes du public pourront continuer à être reçues pendant l’entracte.
      </p>
    </div>
  </div>
)}

{isPreparationOpen && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6">
    <div className="w-full max-w-xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            G3 Live
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Préparation
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsPreparationOpen(false)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={() => {
            setIsPreparationOpen(false);
            setIsNewSongEditorOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left text-lg font-semibold"
        >
          + Nouveau morceau
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPreparationOpen(false);
            setIsSongEditorOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left text-lg font-semibold"
        >
          Modifier le morceau
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPreparationOpen(false);
            setIsSyncEditorOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left text-lg font-semibold"
        >
          Synchroniser les paroles
        </button>
      </div>
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

{isSongEditorOpen && (
  <SongEditor
    song={currentSong}
    onClose={() => setIsSongEditorOpen(false)}
    onSave={(updatedSong) => {
      setSongs((currentSongs) =>
        currentSongs.map((song, index) =>
          index === currentSongIndex ? updatedSong : song
        )
      );

      setIsSongEditorOpen(false);
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