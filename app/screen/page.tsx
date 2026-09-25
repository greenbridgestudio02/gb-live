"use client";

import { useEffect, useRef, useState } from "react";

type LyricLine = {
  time: number;
  text: string;
};

type LiveSong = {
  id: string;
  title: string;
  artist?: string;
  kind?: string;
  needsLyricsSync?: boolean;
  lyricLines?: LyricLine[];
};

type LiveState = {
  mode: string;
  song: LiveSong | null;
  elapsedTime: number;
  isPlaying: boolean;
  message: string;
  messageUpdatedAt: number;
  updatedAt: number;
};

const LYRICS_LEAD = 0.15;

export default function ScreenPage() {
  const [liveState, setLiveState] = useState<LiveState>({
    mode: "home",
    song: null,
    elapsedTime: 0,
    isPlaying: false,
    message: "",
    messageUpdatedAt: 0,
    updatedAt: 0,
  });

  const [displayElapsedTime, setDisplayElapsedTime] = useState(0);
const [isMessageVisible, setIsMessageVisible] = useState(false);
const [lyricsFinished, setLyricsFinished] = useState(false);
  const clockStartRef = useRef<number | null>(null);
  const clockBaseRef = useRef(0);
const lastMessageUpdatedAtRef = useRef(0);
const songHasPlayedRef = useRef(false);


useEffect(() => {
  setLyricsFinished(false);
  songHasPlayedRef.current = false;
}, [liveState.song?.id]);

useEffect(() => {
  if (liveState.isPlaying) {
    songHasPlayedRef.current = true;
  }
}, [liveState.isPlaying]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function loadInitialState() {
      try {
        const response = await fetch("/api/live-state", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const state: LiveState = await response.json();

lastMessageUpdatedAtRef.current = state.messageUpdatedAt;
setLiveState(state);
      } catch {
        // On conserve le dernier état connu.
      }
    }

    void loadInitialState();

    eventSource = new EventSource("/api/live-state?stream=1");

    eventSource.onmessage = (event) => {
  try {
    const state: LiveState = JSON.parse(event.data);

    setLiveState(state);

    if (
  state.message &&
  state.messageUpdatedAt > lastMessageUpdatedAtRef.current
) {
  lastMessageUpdatedAtRef.current = state.messageUpdatedAt;
  setIsMessageVisible(true);
}
  } catch {
    // On conserve le dernier état valide.
  }
};

    return () => {
      eventSource?.close();
    };
  }, []);

  useEffect(() => {
    if (!isMessageVisible) return;

    const timer = window.setTimeout(() => {
      setIsMessageVisible(false);
    }, 8000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [liveState.messageUpdatedAt, isMessageVisible]);

  useEffect(() => {
    clockBaseRef.current = liveState.elapsedTime;

    if (liveState.isPlaying) {
      clockStartRef.current = performance.now();
    } else {
      clockStartRef.current = null;
      setDisplayElapsedTime(
        liveState.elapsedTime + LYRICS_LEAD
      );
    }
  }, [
    liveState.elapsedTime,
    liveState.isPlaying,
    liveState.song?.id,
  ]);

  useEffect(() => {
    if (!liveState.isPlaying) return;

    let animationFrameId: number;

    function updateClock() {
      if (clockStartRef.current !== null) {
        const elapsed =
          clockBaseRef.current +
          (performance.now() - clockStartRef.current) / 1000;

        setDisplayElapsedTime(elapsed + LYRICS_LEAD);
      }

      animationFrameId =
        requestAnimationFrame(updateClock);
    }

    animationFrameId =
      requestAnimationFrame(updateClock);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    liveState.isPlaying,
    liveState.song?.id,
  ]);

useEffect(() => {
  const lyricLines = liveState.song?.lyricLines ?? [];

  if (
  lyricLines.length === 0 ||
  lyricsFinished
) {
  return;
}

  const lastLine = lyricLines[lyricLines.length - 1];
  if (
  !liveState.isPlaying &&
  songHasPlayedRef.current
) {
  setLyricsFinished(true);
  return;
}
  const timeAfterLastLine =
    displayElapsedTime - lastLine.time;

  if (timeAfterLastLine < 8) {
    return;
  }

  setLyricsFinished(true);
}, [
  displayElapsedTime,
  liveState.isPlaying,
  liveState.song,
  lyricsFinished,
]);

  const currentSong = liveState.song;
  const lyricLines = currentSong?.lyricLines ?? [];

  let currentLineIndex = -1;

  if (lyricLines.length > 0) {
  currentLineIndex = -1;

    for (
      let index = 0;
      index < lyricLines.length;
      index++
    ) {
      if (
        displayElapsedTime >= lyricLines[index].time
      ) {
        currentLineIndex = index;
      } else {
        break;
      }
    }
  }

  const showWelcome =
  !currentSong ||
  liveState.mode === "pause" ||
  liveState.mode === "home" ||
  lyricsFinished;

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white">
      {showWelcome ? (
  <div className="flex h-full w-full items-center justify-center bg-black p-8">
    <img
      src="/g3-live-logo.png"
      alt="G3 Live by Green Bridge Studio"
      className="max-h-[90vh] max-w-[90vw] object-contain"
    />
  </div>
) : liveState.mode === "message" ? (
  <div className="flex h-full w-full flex-col items-center justify-center bg-black px-16 text-center">
    <img
      src="/g3-live-logo.png"
      alt="G3 Live"
      className="h-48 w-auto object-contain"
    />

    <p className="mt-8 max-w-5xl text-6xl font-black leading-tight text-amber-300">
      {liveState.message}
    </p>
  </div>
) : liveState.mode === "dj" ? (
  <div className="h-full w-full overflow-hidden bg-black">
    <video
      src="/dj-loop.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover"
    />
  </div>
) : (
        <div className="flex h-full flex-col">
          <header className="shrink-0 px-12 pt-5 pb-2 text-center">
  <img
    src="/g3-live-logo.png"
    alt="G3 Live"
    className="mx-auto h-56 w-auto object-contain"
  />

  <h1 className="mt-1 text-4xl font-black text-white">
    {currentSong.title}
  </h1>

  {currentSong.artist && (
    <p className="mt-1 text-2xl font-semibold text-zinc-400">
      {currentSong.artist}
    </p>
  )}
</header>

          <section className="flex min-h-0 flex-1 items-center justify-center px-16 -translate-y-20">
            {lyricLines.length === 0 ? (
              <p className="text-3xl text-zinc-600">
                ♪
              </p>
            ) : (
              <div className="w-full max-w-6xl text-center">
                {lyricLines.map((line, index) => {
                  const distance =
                    index - currentLineIndex;
                  if (currentLineIndex === -1) {
  return null;
}
                  if (distance < -1 || distance > 2) {
                    return null;
                  }

                  const isCurrent = distance === 0;
                  const isPast = distance < 0;

                  return (
                    <div
                      key={`${line.time}-${index}`}
                      className={`py-4 font-bold leading-tight transition-all duration-300 ${
                        isCurrent
                          ? "text-6xl text-emerald-300"
                          : isPast
                            ? "text-3xl text-zinc-800"
                            : "text-4xl text-zinc-500"
                      }`}
                    >
                      {line.text}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          
        </div>
            )}

      {isMessageVisible && liveState.message && (
        <div className="pointer-events-none absolute inset-x-0 bottom-12 z-50 flex justify-center px-12">
          <div className="max-w-5xl rounded-3xl border-2 border-amber-300 bg-black/90 px-12 py-7 text-center shadow-2xl">
            <p className="text-5xl font-black leading-tight text-amber-300">
              {liveState.message}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}