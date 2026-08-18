"use client";

import { useEffect, useRef, useState } from "react";

import SongList from "./components/SongList";
import { show } from "../data/show";
import SongSearch from "./components/SongSearch";
import LyricsPlayer from "./components/LyricsPlayer";
import LyricsSyncEditor from "./components/LyricsSyncEditor";
import SongEditor from "./components/SongEditor";
import NewSongEditor from "./components/NewSongEditor";
import RequestsPanel from "./components/RequestsPanel";

function BlindTestAdminPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  type BuzzEntry = {
    playerId: string;
    playerName: string;
    buzzedAt: number;
  };

  type PlayerScore = {
    playerId: string;
    playerName: string;
    points: number;
  };

  type BlindTestState = {
    roundId: number;
    isOpen: boolean;
    winner: BuzzEntry | null;
    buzzes: BuzzEntry[];
    scores: PlayerScore[];
    updatedAt: number;
  };

  const [blindState, setBlindState] =
    useState<BlindTestState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let stopped = false;

    async function refreshState() {
      try {
        const response = await fetch("/api/blind-test", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const state: BlindTestState = await response.json();
        if (!stopped) setBlindState(state);
      } catch {
        // On conserve le dernier état connu.
      }
    }

    void refreshState();
    const intervalId = window.setInterval(() => {
      void refreshState();
    }, 250);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, []);

  async function sendAction(
    action:
      | "open"
      | "close"
      | "reset"
      | "correct"
      | "wrong"
      | "reset-scores"
      | "new-game"
  ) {
    if (busy) return;
    setBusy(true);

    try {
      const response = await fetch("/api/blind-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const result = await response.json();
      if (result.state) setBlindState(result.state);
    } finally {
      setBusy(false);
    }
  }

  const ranking = [...(blindState?.scores ?? [])].sort(
    (a, b) => b.points - a.points || a.playerName.localeCompare(b.playerName)
  );

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-6">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-amber-800 bg-zinc-950 text-zinc-100">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              G3 Live
            </p>
            <h2 className="mt-1 text-3xl font-black">🔔 Blind Test</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex min-h-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Question</p>
                <p className="mt-1 text-3xl font-bold">{blindState?.roundId ?? "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">État</p>
                <p
  className={`mt-1 rounded-xl px-4 py-2 text-xl font-black ${
    blindState?.isOpen
      ? "bg-emerald-950/50 text-emerald-300"
      : "bg-red-950/50 text-red-300"
  }`}
>
  {blindState?.isOpen
    ? "🟢 BUZZERS OUVERTS"
    : "🔴 BUZZERS FERMÉS"}
</p>
              </div>
            </div>

            <div className="mt-8 flex min-h-64 flex-1 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8 text-center">
              {blindState?.winner ? (
                <div>
                  <p className="text-7xl">🥇</p>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">Premier buzz</p>
                  <p className="mt-3 text-5xl font-black text-white">{blindState.winner.playerName}</p>
                </div>
              ) : blindState?.isOpen ? (
                <div>
                  <p className="text-7xl">🔴</p>
                  <p className="mt-5 text-3xl font-black text-emerald-300">Buzzers ouverts</p>
                  <p className="mt-3 text-zinc-500">En attente du premier joueur…</p>
                </div>
              ) : (
                <div>
                  <p className="text-6xl">🔔</p>
                  <p className="mt-5 text-3xl font-bold text-zinc-400">Manche prête</p>
                  <p className="mt-3 text-zinc-600">Ouvre les buzzers quand tu es prêt.</p>
                </div>
              )}
            </div>

            {blindState?.winner && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => void sendAction("correct")}
                  disabled={busy}
                  className="rounded-2xl bg-emerald-500 px-6 py-5 text-xl font-black text-zinc-950 disabled:opacity-40"
                >
                  ✅ Bonne réponse · +1
                </button>
                <button
                  type="button"
                  onClick={() => void sendAction("wrong")}
                  disabled={busy}
                  className="rounded-2xl bg-red-600 px-6 py-5 text-xl font-black text-white disabled:opacity-40"
                >
                  ❌ Mauvaise réponse
                </button>
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => void sendAction("open")} disabled={busy} className="rounded-2xl bg-emerald-500 px-6 py-5 text-xl font-black text-zinc-950 disabled:opacity-40">
                ▶ Nouvelle question
              </button>
              <button type="button" onClick={() => void sendAction("close")} disabled={busy} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-xl font-bold disabled:opacity-40">
                Fermer les buzzers  
              </button>
              <button type="button" onClick={() => void sendAction("open")} disabled={busy} className="rounded-2xl border border-amber-700 bg-amber-950/30 px-6 py-5 text-lg font-bold text-amber-300 disabled:opacity-40">
                ↺ Réouvrir les buzzers
              </button>
                          </div>
          </div>

          <div className="grid min-h-0 gap-5 xl:grid-rows-2">
            <div className="min-h-0 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Ordre des buzz</p>
              <div className="mt-4 space-y-3">
                {blindState?.buzzes && blindState.buzzes.length > 0 ? (
                  blindState.buzzes.map((buzz, index) => (
                    <div key={`${buzz.playerId}-${buzz.buzzedAt}`} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-950/50 font-bold text-amber-300">{index + 1}</span>
                      <p className="min-w-0 flex-1 truncate text-lg font-semibold">{buzz.playerName}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-zinc-600">Aucun buzz pour le moment.</p>
                )}
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto rounded-2xl border border-amber-900/60 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">Classement</p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Remettre tous les scores à zéro ?")) {
                      void sendAction("reset-scores");
                    }
                  }}
                  disabled={busy || ranking.length === 0}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-400 disabled:opacity-30"
                >
                  Remise à zéro
                </button>
              </div>

                  <button
  type="button"
  onClick={() => {
    const confirmed = window.confirm(
      "Nouvelle partie ? Tous les scores seront remis à zéro."
    );

    if (!confirmed) {
      return;
    }

    void sendAction("new-game");
  }}
  disabled={busy}
  className="mt-4 w-full rounded-xl border border-red-800 bg-red-950/30 px-5 py-4 font-semibold text-red-300 disabled:opacity-40"
>
  🎮 Nouvelle partie
</button>

              <div className="mt-4 space-y-2">
                {ranking.length > 0 ? (
                  ranking.map((player, index) => (
                    <div key={player.playerId} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                      <span className="w-8 text-center text-lg font-black text-amber-300">{index + 1}</span>
                      <p className="min-w-0 flex-1 truncate font-semibold">{player.playerName}</p>
                      <p className="text-xl font-black text-white">{player.points} <span className="text-xs font-semibold text-zinc-500">pt{player.points > 1 ? "s" : ""}</span></p>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-zinc-600">Le classement apparaîtra dès le premier buzz.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [setlistPosition, setSetlistPosition] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isHomeMode, setIsHomeMode] = useState(true);
  const [isPublicMessageOpen, setIsPublicMessageOpen] = useState(false);
  const [publicMessage, setPublicMessage] = useState("");

  const [isPaused, setIsPaused] = useState(false);

  const [isSetlistOpen, setIsSetlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [requestedSongIds, setRequestedSongIds] = useState<string[]>([]);
  const [requestsLoaded, setRequestsLoaded] = useState(false);
  const [isSyncEditorOpen, setIsSyncEditorOpen] = useState(false);
  const [isSongEditorOpen, setIsSongEditorOpen] = useState(false);
  const [isNewSongEditorOpen, setIsNewSongEditorOpen] = useState(false);

  const [isAboutEditorOpen, setIsAboutEditorOpen] = useState(false);
  const [aboutMe, setAboutMe] = useState({
  name: "",
  headline: "",
  bio: "",
  instruments: "",
  website: "",
  instagram: "",
  facebook: "",
});

  const [songs, setSongs] = useState(show.songs);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [setlistSongIds, setSetlistSongIds] = useState<string[]>(
  show.songs.map((song) => song.id)
);
  const [setlistLoaded, setSetlistLoaded] = useState(false);
  const [isPreparationOpen, setIsPreparationOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isBlindTestOpen, setIsBlindTestOpen] = useState(false);
  const lastServerUpdatedAtRef = useRef(0);
  const applyingServerSnapshotRef = useRef(false);

useEffect(() => {
  let stopped = false;

  async function loadServerLibrary() {
    try {
      const response = await fetch("/api/library-sync", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de charger la bibliothèque serveur.");
      }

      const snapshot = await response.json();

      if (typeof snapshot.updatedAt === "number") {
        lastServerUpdatedAtRef.current = snapshot.updatedAt;
      }

      if (stopped) {
        return;
      }

      if (Array.isArray(snapshot.songs) && snapshot.songs.length > 0) {
        setSongs(snapshot.songs);
      }

      if (Array.isArray(snapshot.setlistSongIds)) {
        setSetlistSongIds(snapshot.setlistSongIds);
      }

      if (Array.isArray(snapshot.requestedSongIds)) {
        setRequestedSongIds(snapshot.requestedSongIds);
      }
    } catch (error) {
      console.error(
        "Impossible de charger la bibliothèque centrale G3 Live.",
        error
      );
    } finally {
      if (!stopped) {
        setSongsLoaded(true);
        setSetlistLoaded(true);
        setRequestsLoaded(true);
      }
    }
  }

  void loadServerLibrary();

  localStorage.removeItem("g3-live-library-v2");
  localStorage.removeItem("gb-live-songs");
  localStorage.removeItem("gb-live-setlist");
  localStorage.removeItem("g3-live-requests");

  return () => {
    stopped = true;
  };
}, []);

useEffect(() => {
  let stopped = false;

  async function loadAboutMe() {
    try {
      const response = await fetch("/api/about", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (!stopped) {
        setAboutMe({
          name:
            typeof data.name === "string"
              ? data.name
              : "",
          headline:
            typeof data.headline === "string"
              ? data.headline
              : "",
          bio:
            typeof data.bio === "string"
              ? data.bio
              : "",
          instruments:
            typeof data.instruments === "string"
              ? data.instruments
              : "",
          website:
            typeof data.website === "string"
              ? data.website
              : "",
          instagram:
            typeof data.instagram === "string"
              ? data.instagram
              : "",
          facebook:
            typeof data.facebook === "string"
              ? data.facebook
              : "",
        });
      }
    } catch (error) {
      console.error(
        "Impossible de charger la fiche À propos de moi.",
        error
      );
    }
  }

  void loadAboutMe();

  return () => {
    stopped = true;
  };
}, []);

useEffect(() => {
  if (!songsLoaded || !setlistLoaded || !requestsLoaded) {
    return;
  }

  if (applyingServerSnapshotRef.current) {
    applyingServerSnapshotRef.current = false;
    return;
  }

  const timeoutId = window.setTimeout(() => {
    void fetch("/api/library-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        songs,
        setlistSongIds,
        requestedSongIds,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Sauvegarde serveur impossible.");
        }

        const result = await response.json();
        const updatedAt = result?.snapshot?.updatedAt;

        if (typeof updatedAt === "number") {
          lastServerUpdatedAtRef.current = updatedAt;
        }
      })
      .catch((error) => {
        console.error(
          "Impossible d'enregistrer automatiquement la bibliothèque sur le serveur.",
          error
        );
      });
  }, 300);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [
  songs,
  setlistSongIds,
  requestedSongIds,
  songsLoaded,
  setlistLoaded,
  requestsLoaded,
]);

useEffect(() => {
  if (!songsLoaded || !setlistLoaded || !requestsLoaded) {
    return;
  }

  let stopped = false;

  async function refreshLibraryFromServer() {
    try {
      const response = await fetch("/api/library-sync", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const snapshot = await response.json();

      if (
        stopped ||
        typeof snapshot.updatedAt !== "number" ||
        snapshot.updatedAt <= lastServerUpdatedAtRef.current
      ) {
        return;
      }

      applyingServerSnapshotRef.current = true;
      lastServerUpdatedAtRef.current = snapshot.updatedAt;

      if (Array.isArray(snapshot.songs)) {
        setSongs(snapshot.songs);
      }

      if (Array.isArray(snapshot.setlistSongIds)) {
        setSetlistSongIds(snapshot.setlistSongIds);
      }

      if (Array.isArray(snapshot.requestedSongIds)) {
        setRequestedSongIds(snapshot.requestedSongIds);
      }
    } catch (error) {
      console.error(
        "Impossible d'actualiser automatiquement la bibliothèque.",
        error
      );
    }
  }

  const intervalId = window.setInterval(() => {
    void refreshLibraryFromServer();
  }, 5000);

  return () => {
    stopped = true;
    window.clearInterval(intervalId);
  };
}, [songsLoaded, setlistLoaded, requestsLoaded]);

const setlistSongs = setlistSongIds
  .map((songId) =>
    songs.find((song) => song.id === songId)
  )
  .filter(
    (song): song is (typeof songs)[number] =>
      song !== undefined
  );

const currentSong = songs[currentSongIndex];

const nextSetlistSong =
  setlistPosition < setlistSongs.length - 1
    ? setlistSongs[setlistPosition + 1]
    : null;

useEffect(() => {
  if (!currentSong) {
    return;
  }

  localStorage.setItem(
    "g3-live-current-song-id",
    currentSong.id
  );
}, [currentSong]);

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

async function sendPublicMode(
  mode:
    | "home"
    | "song"
    | "message"
    | "pause"
    | "end",
  message = ""
) {
  try {
    await fetch("/api/live-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        mode,
        message,
      }),
    });
  } catch (error) {
    console.error(
      "Impossible de modifier l'écran public.",
      error
    );
  }
}

function startShow() {
  setIsHomeMode(false);
  setIsSetlistOpen(true);
}

function returnHome() {
  setIsHomeMode(true);
  setIsPublicMessageOpen(false);
  void sendPublicMode("home");
}

useEffect(() => {
  if (isHomeMode) {
    void sendPublicMode("home");
  }
}, [isHomeMode]);

function showPublicMessage(message: string) {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return;
  }

  void sendPublicMode("message", cleanMessage);
}

function clearPublicMessage() {
  setPublicMessage("");
  setIsPublicMessageOpen(false);

  if (isHomeMode) {
    void sendPublicMode("home");
  } else {
    void sendPublicMode("song");
  }
}

useEffect(() => {
  function handleBlueTurnNext(event: KeyboardEvent) {
    if (event.key !== "ArrowRight") {
      return;
    }

    const target = event.target as HTMLElement | null;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable
    ) {
      return;
    }

    if (event.repeat) {
      return;
    }

    event.preventDefault();

    goToNextSong();
  }

  window.addEventListener(
    "keydown",
    handleBlueTurnNext
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleBlueTurnNext
    );
  };
});

async function publishLibrary() {
  try {
    const response = await fetch("/api/library-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        songs,
        setlistSongIds,
        requestedSongIds,
      }),
    });

    if (!response.ok) {
      throw new Error("Publication impossible");
    }

    alert("Bibliothèque publiée sur le serveur G3 Live.");
  } catch (error) {
    console.error(error);
    alert("Impossible de publier la bibliothèque.");
  }
}

async function importLibrary() {
  try {
    const response = await fetch("/api/library-sync", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Récupération impossible");
    }

    const snapshot = await response.json();

    if (
      !Array.isArray(snapshot.songs) ||
      snapshot.songs.length === 0
    ) {
      alert("Aucune bibliothèque publiée sur le serveur.");
      return;
    }

    const localSnapshot = {
      songs: snapshot.songs,
      setlistSongIds: Array.isArray(snapshot.setlistSongIds)
        ? snapshot.setlistSongIds
        : [],
      requestedSongIds: Array.isArray(snapshot.requestedSongIds)
        ? snapshot.requestedSongIds
        : [],
      savedAt: Date.now(),
    };

    setSongs(localSnapshot.songs);
    setSetlistSongIds(localSnapshot.setlistSongIds);
    setRequestedSongIds(localSnapshot.requestedSongIds);

    setCurrentSongIndex(0);
    setSetlistPosition(0);

    alert(
      "Bibliothèque récupérée et sauvegardée durablement sur cet appareil."
    );
  } catch (error) {
    console.error(error);
    alert("Impossible de récupérer la bibliothèque.");
  }
}if (isHomeMode) {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-3xl text-center">
        <img
          src="/g3-live-logo.png"
          alt="G3 Live"
          className="mx-auto h-32 w-auto object-contain"
        />

        <h1 className="mt-6 text-5xl font-bold">
          Bienvenue
        </h1>

        <p className="mt-3 text-lg text-zinc-500">
          G3 Live est prêt.
        </p>

        <div className="mt-10 grid gap-4">
          <button
  type="button"
  onClick={startShow}
  className="w-full rounded-2xl border border-emerald-700 bg-emerald-950/30 px-6 py-5 text-xl font-bold text-emerald-300 transition hover:bg-emerald-950/50 active:scale-[0.99]"
>
  🎤 Spectacle
</button>

<button
  type="button"
  onClick={() => setIsBlindTestOpen(true)}
  className="w-full rounded-2xl border border-amber-700 bg-amber-950/30 px-6 py-5 text-xl font-bold text-amber-300 transition hover:bg-amber-950/50 active:scale-[0.99]"
>
  🔔 Blind Test
</button>

<button
  type="button"
  onClick={() => setIsPreparationOpen(true)}
  className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-xl font-bold text-zinc-100 transition hover:bg-zinc-800 active:scale-[0.99]"
>
  ⚙️ Préparation
</button>



        </div>
      </div>

      {isSearchOpen && (
        <SongSearch
          songs={songs}
          setlistSongIds={setlistSongIds}
          requestedSongIds={requestedSongIds}
          onPlayNow={(index) => {
            setCurrentSongIndex(index);

            const selectedSongId = songs[index]?.id;
            const setlistIndex = selectedSongId
              ? setlistSongIds.indexOf(selectedSongId)
              : -1;

            if (setlistIndex !== -1) {
              setSetlistPosition(setlistIndex);
            }

            setIsHomeMode(false);
            void sendPublicMode("song");
          }}
          onPlayNext={(songId) => {
            setSetlistSongIds((currentSetlist) => {
              const withoutSong = currentSetlist.filter(
                (id) => id !== songId
              );

              const insertPosition = Math.min(
                setlistPosition + 1,
                withoutSong.length
              );

              const newSetlist = [...withoutSong];
              newSetlist.splice(insertPosition, 0, songId);

              return newSetlist;
            });
          }}
          onAddToSetlist={(songId) => {
            setSetlistSongIds((currentSetlist) =>
              currentSetlist.includes(songId)
                ? currentSetlist
                : [...currentSetlist, songId]
            );
          }}
          onRequestSong={(songId) => {
            setRequestedSongIds((currentRequests) =>
              currentRequests.includes(songId)
                ? currentRequests
                : [...currentRequests, songId]
            );
          }}
          onEditSong={(index) => {
  setCurrentSongIndex(index);
  setIsSearchOpen(false);
  setIsSongEditorOpen(true);
}}

onSyncSong={(index) => {
  setCurrentSongIndex(index);
  setIsSearchOpen(false);
  setIsSyncEditorOpen(true);
}}

onDeleteSong={(songId) => {
  setSongs((currentSongs) =>
    currentSongs.filter((song) => song.id !== songId)
  );

  setSetlistSongIds((currentIds) =>
    currentIds.filter((id) => id !== songId)
  );

  setRequestedSongIds((currentIds) =>
    currentIds.filter((id) => id !== songId)
  );
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

            if (libraryIndex !== -1) {
              setCurrentSongIndex(libraryIndex);
            }

            setRequestedSongIds((currentRequests) =>
              currentRequests.filter((id) => id !== songId)
            );

            setIsRequestsOpen(false);
            setIsHomeMode(false);
            void sendPublicMode("song");
          }}
          onPlayNext={(songId) => {
            setSetlistSongIds((currentSetlist) => {
              const withoutSong = currentSetlist.filter(
                (id) => id !== songId
              );

              const insertPosition = Math.min(
                setlistPosition + 1,
                withoutSong.length
              );

              const newSetlist = [...withoutSong];
              newSetlist.splice(insertPosition, 0, songId);

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
          onMoveRequest={(fromIndex, toIndex) => {
            setRequestedSongIds((currentRequests) => {
              const newRequests = [...currentRequests];
              const [movedSongId] = newRequests.splice(fromIndex, 1);
              newRequests.splice(toIndex, 0, movedSongId);
              return newRequests;
            });
          }}
          onClose={() => setIsRequestsOpen(false)}
        />
       )}

      {isBlindTestOpen && (
  <BlindTestAdminPanel
    onClose={() => setIsBlindTestOpen(false)}
  />
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
    setIsSearchOpen(true);
  }}
  className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left text-lg font-semibold"
>
  📚 Bibliothèque
</button>

        <button
          type="button"
          onClick={publishLibrary}
          className="rounded-xl border border-sky-700 bg-sky-950/30 px-6 py-4 text-left text-lg font-semibold text-sky-300"
        >
          ↑ Publier la bibliothèque
        </button>

        <button
          type="button"
          onClick={importLibrary}
          className="rounded-xl border border-violet-700 bg-violet-950/30 px-6 py-4 text-left text-lg font-semibold text-violet-300"
        >
          ↓ Récupérer la bibliothèque
        </button>

        <button
  type="button"
  onClick={() => {
    setIsPreparationOpen(false);
    setIsAboutEditorOpen(true);
  }}
  className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left text-lg font-semibold"
>
  👤 Modifier “À propos de moi”
</button>


      </div>
    </div>
  </div>
)}

{isAboutEditorOpen && (
  <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/90 p-6">
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            G3 Live
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            À propos de moi
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAboutEditorOpen(false)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <input
          type="text"
          value={aboutMe.name}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              name: event.target.value,
            })
          }
          placeholder="Nom / nom de scène"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.headline}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              headline: event.target.value,
            })
          }
          placeholder="Accroche"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <textarea
          value={aboutMe.bio}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              bio: event.target.value,
            })
          }
          placeholder="Présentation"
          className="min-h-40 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.instruments}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              instruments: event.target.value,
            })
          }
          placeholder="Instruments"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.website}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              website: event.target.value,
            })
          }
          placeholder="Site web"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.instagram}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              instagram: event.target.value,
            })
          }
          placeholder="Instagram"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.facebook}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              facebook: event.target.value,
            })
          }
          placeholder="Facebook"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />
      </div>

      <button
  type="button"
  onClick={async () => {
    try {
      const response = await fetch("/api/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutMe),
      });

      if (!response.ok) {
        throw new Error("Publication impossible");
      }

      localStorage.setItem(
        "g3-live-about",
        JSON.stringify(aboutMe)
      );

      setIsAboutEditorOpen(false);

      alert(
        "La fiche « À propos de moi » est enregistrée et publiée."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Impossible de publier la fiche « À propos de moi »."
      );
    }
  }}
  className="mt-6 w-full rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-zinc-950"
>
  Enregistrer
</button>
    </div>
  </div>
)}

{isNewSongEditorOpen && (
  <NewSongEditor
    onClose={() => setIsNewSongEditorOpen(false)}
    onSave={(newSong) => {
      setSongs((currentSongs) => [
        ...currentSongs,
        newSong,
      ]);

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
          index === currentSongIndex
            ? updatedSong
            : song
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
              if (
                index !== currentSongIndex ||
                !song.lyricLines
              ) {
                return song;
              }

              return {
                ...song,
                lyricLines: song.lyricLines.map(
                  (line, lineIndex) => ({
                    ...line,
                    time: times[lineIndex],
                  })
                ),
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
    </main>
  );
}

  return (
    <main className="flex h-[100dvh] overflow-hidden flex-col bg-zinc-950 text-zinc-100">
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
            onClick={() => {
  setIsPaused(true);
  void sendPublicMode("pause");
}}
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

<div className="mt-2 grid grid-cols-8 gap-3">
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
  onClick={() => setIsPublicMessageOpen(true)}
  className="rounded-xl border border-amber-700 bg-amber-950/30 px-4 py-3 font-semibold text-amber-300"
>
  Message public
</button>

<button
  type="button"
  onClick={returnHome}
  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold"
>
  Accueil
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

  setCurrentSongIndex(libraryIndex);
  setSetlistPosition(setlistIndex);

  setIsSetlistOpen(false);

  void sendPublicMode("song");
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
      setCurrentSongIndex(index);

      const selectedSongId = songs[index]?.id;
      const setlistIndex = selectedSongId
        ? setlistSongIds.indexOf(selectedSongId)
        : -1;

      if (setlistIndex !== -1) {
        setSetlistPosition(setlistIndex);
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
onEditSong={(index) => {
  setCurrentSongIndex(index);
  setIsSearchOpen(false);
  setIsSongEditorOpen(true);
}}

onSyncSong={(index) => {
  setCurrentSongIndex(index);
  setIsSearchOpen(false);
  setIsSyncEditorOpen(true);
}}    

onDeleteSong={(songId) => {
  setSongs((currentSongs) =>
    currentSongs.filter((song) => song.id !== songId)
  );

  setSetlistSongIds((currentIds) =>
    currentIds.filter((id) => id !== songId)
  );

  setRequestedSongIds((currentIds) =>
    currentIds.filter((id) => id !== songId)
  );
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
    
    onMoveRequest={(fromIndex, toIndex) => {
  setRequestedSongIds((currentRequests) => {
    const newRequests = [...currentRequests];

    const [movedSongId] = newRequests.splice(fromIndex, 1);
    newRequests.splice(toIndex, 0, movedSongId);

    return newRequests;
  });
}}
    
    onClose={() => setIsRequestsOpen(false)}
  />
)}

{isPublicMessageOpen && (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-6">
    <div className="w-full max-w-2xl rounded-3xl border border-amber-800 bg-zinc-950 p-6 text-zinc-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            G3 Live
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Message public
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsPublicMessageOpen(false)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <textarea
        value={publicMessage}
        onChange={(event) => setPublicMessage(event.target.value)}
        placeholder="Écrivez un message au public…"
        className="mt-6 min-h-36 w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-2xl outline-none focus:border-amber-500"
      />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          "Merci ! 🙏",
          "Vous êtes les meilleurs ❤️",
          "Je vous adore 😍",
          "Bravo 👏",
          "🔥",
          "🎶",
          "❤️",
          "On revient bientôt 🎹",
        ].map((message) => (
          <button
            key={message}
            type="button"
            onClick={() => setPublicMessage(message)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold"
          >
            {message}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            showPublicMessage(publicMessage);
            setIsPublicMessageOpen(false);
          }}
          disabled={!publicMessage.trim()}
          className="rounded-xl bg-amber-400 px-6 py-4 text-lg font-bold text-zinc-950 disabled:opacity-30"
        >
          Envoyer
        </button>

        <button
          type="button"
          onClick={clearPublicMessage}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-lg font-semibold"
        >
          Effacer l’écran public
        </button>
      </div>
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
            setIsSearchOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left text-lg font-semibold"
        >
          📚 Bibliothèque
        </button>

        

<button
  type="button"
  onClick={publishLibrary}
  className="rounded-xl border border-sky-700 bg-sky-950/30 px-6 py-4 text-left text-lg font-semibold text-sky-300"
>
  ↑ Publier la bibliothèque
</button>

<button
  type="button"
  onClick={importLibrary}
  className="rounded-xl border border-violet-700 bg-violet-950/30 px-6 py-4 text-left text-lg font-semibold text-violet-300"
>
  ↓ Récupérer la bibliothèque
</button>

        <button
          type="button"
          onClick={() => {
            setIsPreparationOpen(false);
            setIsAboutEditorOpen(true);
          }}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left text-lg font-semibold"
        >
          👤 Modifier “À propos de moi”
        </button>

      </div>
    </div>
  </div>
)}

{isAboutEditorOpen && (
  <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/90 p-6">
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            G3 Live
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            À propos de moi
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAboutEditorOpen(false)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <input
          type="text"
          value={aboutMe.name}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              name: event.target.value,
            })
          }
          placeholder="Nom / nom de scène"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.headline}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              headline: event.target.value,
            })
          }
          placeholder="Accroche"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <textarea
          value={aboutMe.bio}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              bio: event.target.value,
            })
          }
          placeholder="Présentation"
          className="min-h-40 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.instruments}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              instruments: event.target.value,
            })
          }
          placeholder="Instruments"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.website}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              website: event.target.value,
            })
          }
          placeholder="Site web"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.instagram}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              instagram: event.target.value,
            })
          }
          placeholder="Instagram"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />

        <input
          type="text"
          value={aboutMe.facebook}
          onChange={(event) =>
            setAboutMe({
              ...aboutMe,
              facebook: event.target.value,
            })
          }
          placeholder="Facebook"
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsAboutEditorOpen(false)}
        className="mt-6 w-full rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-zinc-950"
      >
        Enregistrer
      </button>
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
          onClick={() => {
  setIsPaused(false);
  void sendPublicMode("song");
}}
          className="rounded-xl bg-emerald-500 px-6 py-5 text-lg font-bold text-zinc-950"
        >
          ▶ Reprendre
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPaused(false);
            void sendPublicMode("song");
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
            void sendPublicMode("end");
          }}
          className="rounded-xl border border-red-700 bg-red-950/40 px-6 py-5 text-lg font-semibold text-red-300"
        >
          🏁 Terminer le spectacle
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