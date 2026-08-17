"use client";

import { useEffect, useState } from "react";

type PublicLyricLine = {
  time: number;
  text: string;
};

type PublicSong = {
  id: string;
  title: string;
  kind?: "vocal" | "instrumental";
  lyrics: string;
  lyricLines: PublicLyricLine[];
  needsLyricsSync?: boolean;
};

type PublicMode = "home" | "song" | "message";

type LocalView =
  | "home"
  | "lyrics"
  | "blind-test";

type LiveState = {
  mode: PublicMode;
  song: PublicSong | null;
  elapsedTime: number;
  isPlaying: boolean;
  message: string;
  updatedAt: number;
};

function BlindTestPanel() {
  type BuzzEntry = {
    playerId: string;
    playerName: string;
    buzzedAt: number;
  };

  type BlindTestState = {
    roundId: number;
    isOpen: boolean;
    winner: BuzzEntry | null;
    buzzes: BuzzEntry[];
    updatedAt: number;
  };

  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [blindState, setBlindState] = useState<BlindTestState | null>(null);
  const [status, setStatus] = useState("En attente...");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem(
      "g3-live-player-name"
    );

    let savedId = localStorage.getItem(
      "g3-live-player-id"
    );

    if (!savedId) {
      savedId =
        crypto.randomUUID?.() ??
        `player-${Date.now()}-${Math.random()}`;

      localStorage.setItem(
        "g3-live-player-id",
        savedId
      );
    }

    if (savedName) {
      setPlayerName(savedName);
    }

    setPlayerId(savedId);
  }, []);

  useEffect(() => {
    let stopped = false;

    async function refreshBlindState() {
      try {
        const response = await fetch(
          "/api/blind-test",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const state: BlindTestState =
          await response.json();

        if (!stopped) {
          setBlindState(state);
        }
      } catch {
        // On garde simplement le dernier état connu.
      }
    }

    void refreshBlindState();

    const intervalId = window.setInterval(() => {
      void refreshBlindState();
    }, 250);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, []);

  function savePlayerName() {
    const cleanName = playerName.trim();

    if (!cleanName) {
      return;
    }

    localStorage.setItem(
      "g3-live-player-name",
      cleanName
    );

    setPlayerName(cleanName);
  }

  async function buzz() {
    const cleanName = playerName.trim();

    if (
      !cleanName ||
      !playerId ||
      !blindState?.isOpen ||
      isSending
    ) {
      return;
    }

    savePlayerName();

    setIsSending(true);
    setStatus("BUZZ envoyé !");

    try {
      const response = await fetch(
        "/api/blind-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "buzz",
            playerId,
            playerName: cleanName,
          }),
        }
      );

      const result = await response.json();

      if (result.state) {
        setBlindState(result.state);
      }

      if (!result.ok) {
        setStatus(
          result.error === "Buzzer fermé"
            ? "Trop tard !"
            : result.error ?? "Buzz refusé"
        );
      }
    } catch {
      setStatus("Erreur réseau");
    } finally {
      setIsSending(false);
    }
  }

  const isWinner =
    blindState?.winner?.playerId === playerId;

  const hasWinner =
    blindState?.winner !== null &&
    blindState?.winner !== undefined;

  return (
    <div className="w-full max-w-xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
        G3 Live
      </p>

      <h1 className="mt-4 text-5xl font-black">
        🔔 Blind Test
      </h1>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Ton prénom / pseudo
        </label>

        <input
          type="text"
          value={playerName}
          onChange={(event) =>
            setPlayerName(event.target.value)
          }
          onBlur={savePlayerName}
          placeholder="Ex. Laurent"
          className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-center text-xl font-semibold outline-none focus:border-amber-500"
        />
      </div>

      <div className="mt-6">
        {isWinner ? (
          <div className="rounded-3xl border border-emerald-600 bg-emerald-950/30 p-8">
            <p className="text-6xl">
              🥇
            </p>

            <p className="mt-4 text-3xl font-black text-emerald-300">
              Tu as buzzé en premier !
            </p>
          </div>
        ) : hasWinner ? (
          <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-8">
            <p className="text-5xl">
              ⏱️
            </p>

            <p className="mt-4 text-2xl font-bold text-zinc-300">
              {blindState?.winner?.playerName}
              {" "}a buzzé en premier
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={buzz}
            disabled={
              !playerName.trim() ||
              !blindState?.isOpen ||
              isSending
            }
            className={`w-full select-none touch-manipulation rounded-full border-4 px-8 py-16 text-4xl font-black transition active:scale-[0.98] ${
              blindState?.isOpen
                ? "border-red-500 bg-red-600 text-white shadow-2xl shadow-red-950/40"
                : "border-zinc-700 bg-zinc-900 text-zinc-600"
            } disabled:cursor-not-allowed`}
          >
            {blindState?.isOpen
              ? "🔴 BUZZER !"
              : "En attente..."}
          </button>
        )}
      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {hasWinner
          ? "Manche terminée"
          : blindState?.isOpen
            ? "Le buzzer est ouvert"
            : status}
      </p>
    </div>
  );
}

export default function PublicPage() {
  const [liveState, setLiveState] = useState<LiveState>({
    mode: "home",
    song: null,
    elapsedTime: 0,
    isPlaying: false,
    message: "",
    updatedAt: 0,
  });

  const [connected, setConnected] = useState(false);
  const [localView, setLocalView] =
    useState<LocalView>("home");

  const [userReturnedHome, setUserReturnedHome] =
    useState(false);

  useEffect(() => {
    let stopped = false;

    async function refreshLiveState() {
      try {
        const response = await fetch("/api/live-state", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!stopped) {
            setConnected(false);
          }

          return;
        }

        const state: LiveState =
          await response.json();

        if (!stopped) {
          setLiveState(state);
          setConnected(true);
        }
      } catch {
        if (!stopped) {
          setConnected(false);
        }
      }
    }

    void refreshLiveState();

    const intervalId = window.setInterval(() => {
      void refreshLiveState();
    }, 250);

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (liveState.mode === "home") {
      setLocalView("home");
      setUserReturnedHome(false);
      return;
    }

    if (liveState.mode === "song") {
      if (!userReturnedHome) {
        setLocalView("lyrics");
      }
    }
  }, [
    liveState.mode,
    liveState.song?.id,
    userReturnedHome,
  ]);

  const currentSong = liveState.song;
  const lyricLines =
    currentSong?.lyricLines ?? [];

  let currentLineIndex = -1;

  if (lyricLines.length > 0) {
    currentLineIndex = 0;

    for (
      let index = 0;
      index < lyricLines.length;
      index++
    ) {
      if (
        liveState.elapsedTime >=
        lyricLines[index].time
      ) {
        currentLineIndex = index;
      } else {
        break;
      }
    }
  }

  const currentLine =
    currentLineIndex >= 0
      ? lyricLines[currentLineIndex]
      : null;

  const nextLine =
    currentLineIndex >= 0 &&
    currentLineIndex < lyricLines.length - 1
      ? lyricLines[currentLineIndex + 1]
      : null;

  function goHome() {
    setLocalView("home");
    setUserReturnedHome(true);
  }

  function openLyrics() {
    setLocalView("lyrics");
    setUserReturnedHome(false);
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-black text-white">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-900 px-5 py-3">
        <img
          src="/g3-live-logo.png"
          alt="G3 Live"
          className="h-16 w-auto object-contain"
        />

        <div className="flex items-center gap-3">
          <p
            className={`hidden text-[10px] uppercase tracking-[0.25em] sm:block ${
              connected
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {connected
              ? "Live connecté"
              : "Connexion..."}
          </p>

          {localView !== "home" && (
            <button
              type="button"
              onClick={goHome}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold"
            >
              ⌂ Accueil
            </button>
          )}
        </div>
      </header>

      <section className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 py-6">
        {liveState.mode === "message" && (
          <div className="w-full max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-400">
              G3 Live
            </p>

            <div className="mt-8 flex min-h-72 items-center justify-center">
              <p className="whitespace-pre-line text-5xl font-black leading-tight sm:text-7xl">
                {liveState.message}
              </p>
            </div>

            <button
              type="button"
              onClick={goHome}
              className="mt-8 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold"
            >
              ⌂ Retour à l'accueil
            </button>
          </div>
        )}

        {liveState.mode !== "message" &&
          localView === "home" && (
            <div className="w-full max-w-xl text-center">
              <img
                src="/g3-live-logo.png"
                alt="G3 Live"
                className="mx-auto h-28 w-auto object-contain"
              />

              <h1 className="mt-6 text-4xl font-bold">
                Bienvenue
              </h1>

              <p className="mt-3 text-zinc-500">
                Profitez du spectacle et participez en direct.
              </p>

              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  onClick={openLyrics}
                  disabled={
                    liveState.mode !== "song" ||
                    !currentSong
                  }
                  className="rounded-2xl bg-emerald-500 px-6 py-5 text-xl font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  🎤 Paroles Live
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setLocalView("blind-test")
                  }
                  className="rounded-2xl border border-amber-700 bg-amber-950/30 px-6 py-5 text-xl font-bold text-amber-300"
                >
                  🔔 Blind Test
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-5 text-xl font-semibold text-zinc-600"
                >
                  🎵 Demander un titre
                  <span className="mt-1 block text-xs">
                    bientôt
                  </span>
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-5 text-xl font-semibold text-zinc-600"
                >
                  ❤️ Envoyer une réaction
                  <span className="mt-1 block text-xs">
                    bientôt
                  </span>
                </button>
              </div>
            </div>
          )}

        {liveState.mode !== "message" &&
  localView === "blind-test" && (
    <BlindTestPanel />
  )}

        {liveState.mode !== "message" &&
          localView === "lyrics" && (
            <>
              {liveState.mode !== "song" ||
              !currentSong ? (
                <div className="text-center">
                  <p className="text-4xl font-bold text-zinc-700">
                    G3 Live
                  </p>

                  <p className="mt-4 text-lg text-zinc-600">
                    Aucun morceau en cours
                  </p>
                </div>
              ) : currentSong.kind ===
                "instrumental" ? (
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-400">
                    Instrumental
                  </p>

                  <h1 className="mt-5 text-5xl font-bold">
                    {currentSong.title}
                  </h1>

                  <p className="mt-8 text-5xl">
                    🎹
                  </p>
                </div>
              ) : currentSong.needsLyricsSync ||
                lyricLines.length === 0 ? (
                <div className="text-center">
                  <h1 className="text-4xl font-bold">
                    {currentSong.title}
                  </h1>

                  <p className="mt-5 text-zinc-600">
                    Paroles indisponibles pour le moment
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-5xl text-center">
                  <p className="mb-8 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-700">
                    {currentSong.title}
                  </p>

                  <div className="flex min-h-36 items-center justify-center">
                    {currentLine && (
                      <p className="text-5xl font-black leading-tight sm:text-7xl">
                        {currentLine.text}
                      </p>
                    )}
                  </div>

                  <div className="mt-10 flex min-h-20 items-center justify-center">
                    {nextLine && (
                      <p className="text-2xl font-medium text-zinc-600 sm:text-3xl">
                        {nextLine.text}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
      </section>

      <footer className="shrink-0 border-t border-zinc-900 px-5 py-3 text-center text-xs text-zinc-700">
        G3 Live • by Green Bridge Studio
      </footer>
    </main>
  );
}