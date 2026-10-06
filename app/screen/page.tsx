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
  videoFile?: string;
  videoMode?: "video" | "video-lyrics";
  videoOffset?: number;
  videoPlaybackMode?: "sync" | "loop" | "timed";
videoDuration?: number;
};

type LiveState = {
  mode: string;
  song: LiveSong | null;
  elapsedTime: number;
  isPlaying: boolean;
  playbackEnded?: boolean;
  videoVolume: number;
  djVideoFile: string;
  djLoop: boolean;
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
    videoVolume: 0.25,
    djVideoFile: "/01-club-original.mp4",
    djLoop: false,
    message: "",
    messageUpdatedAt: 0,
    updatedAt: 0,
  });

  const [displayElapsedTime, setDisplayElapsedTime] = useState(0);
const [isMessageVisible, setIsMessageVisible] = useState(false);
const [lyricsFinished, setLyricsFinished] = useState(false);
const [coupParfaitCountdown, setCoupParfaitCountdown] = useState<
  number | "go"
>(3);
const [coupParfaitVideoEnded, setCoupParfaitVideoEnded] = useState(false);
const [airGuitarCountdown, setAirGuitarCountdown] = useState<
  number | "rock"
>(3);
const [airGuitarChallenge, setAirGuitarChallenge] = useState<string | null>(
  null
);
const [airGuitarTutoStep, setAirGuitarTutoStep] = useState(1);
const [airGuitarSong, setAirGuitarSong] = useState<string | null>(null);
const airGuitarSongRef = useRef<HTMLAudioElement | null>(null);
const [audioUnlocked, setAudioUnlocked] = useState(false);
const airGuitarAudioRef = useRef<HTMLAudioElement | null>(null);
  const clockStartRef = useRef<number | null>(null);
  const clockBaseRef = useRef(0);
const lastMessageUpdatedAtRef = useRef(0);
const songHasPlayedRef = useRef(false);
const videoRef = useRef<HTMLVideoElement | null>(null);
const coupParfaitVideoRef = useRef<HTMLVideoElement | null>(null);
const coupParfaitSongVideoRef = useRef<HTMLVideoElement | null>(null);
useEffect(() => {
  if (coupParfaitVideoRef.current) {
    coupParfaitVideoRef.current.volume = liveState.videoVolume ?? 0.25;
  }
  if (coupParfaitSongVideoRef.current) {
    coupParfaitSongVideoRef.current.volume = liveState.videoVolume ?? 0.25;
  }
}, [liveState.videoVolume, liveState.mode]);
useEffect(() => {
  if (liveState.mode !== "coup-parfait-ready") {
    setCoupParfaitCountdown(3);
    return;
  }
setCoupParfaitVideoEnded(false);
  setCoupParfaitCountdown(3);

  const timer2 = window.setTimeout(() => {
    setCoupParfaitCountdown(2);
  }, 1000);

  const timer1 = window.setTimeout(() => {
    setCoupParfaitCountdown(1);
  }, 2000);

  const timerGo = window.setTimeout(() => {
    setCoupParfaitCountdown("go");
  }, 3000);

  return () => {
    window.clearTimeout(timer2);
    window.clearTimeout(timer1);
    window.clearTimeout(timerGo);
  };
}, [liveState.mode]);

useEffect(() => {
  if (liveState.mode !== "air-guitar-ready") {
    setAirGuitarCountdown(3);
    
    return;
  }

  setAirGuitarCountdown(3);

  if (
  liveState.message &&
  liveState.message.startsWith("/audio/air-guitar/")
) {
  setAirGuitarSong(liveState.message);
}
  const timer2 = window.setTimeout(() => {
    setAirGuitarCountdown(2);
  }, 1000);

  const timer1 = window.setTimeout(() => {
    setAirGuitarCountdown(1);
  }, 2000);

  const timerRock = window.setTimeout(() => {
    setAirGuitarCountdown("rock");
  }, 3000);

  return () => {
    window.clearTimeout(timer2);
    window.clearTimeout(timer1);
    window.clearTimeout(timerRock);
  };
}, [liveState.mode, liveState.message]);

useEffect(() => {
  if (liveState.mode !== "air-guitar-challenge") {
    return;
  }

  const challengeLabels: Record<string, string> = {
    knees: "🔥 SOLO À GENOUX !",
    "behind-head": "🤘 DERRIÈRE LA TÊTE !",
    crowd: "📣 FAIS CRIER LE PUBLIC !",
    "crazy-solo": "⚡ SOLO DE FOLIE !",
  };

  const challenge =
    challengeLabels[liveState.message] ?? liveState.message;

  setAirGuitarChallenge(challenge);

  const timer = window.setTimeout(() => {
    setAirGuitarChallenge(null);
  }, 3000);

  return () => {
    window.clearTimeout(timer);
  };
}, [liveState.mode, liveState.message, liveState.messageUpdatedAt]);

useEffect(() => {
  if (liveState.mode !== "air-guitar-tuto") {
    setAirGuitarTutoStep(1);
    return;
  }

  setAirGuitarTutoStep(1);

  const step2 = window.setTimeout(() => {
    setAirGuitarTutoStep(2);
  }, 2500);

  const step3 = window.setTimeout(() => {
    setAirGuitarTutoStep(3);
  }, 5000);

  const finalStep = window.setTimeout(() => {
    setAirGuitarTutoStep(4);
  }, 7500);

  const finish = window.setTimeout(() => {
    void fetch("/api/live-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "air-guitar",
      }),
    });
  }, 11000);

  return () => {
    window.clearTimeout(step2);
    window.clearTimeout(step3);
    window.clearTimeout(finalStep);
    window.clearTimeout(finish);
  };
}, [liveState.mode]);

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
  const video = videoRef.current;

  if (!video || !liveState.song?.videoFile) {
    return;
  }

const videoPlaybackMode =
  liveState.song.videoPlaybackMode ?? "sync";

if (videoPlaybackMode !== "sync") {
  return;
}

  const videoOffset = liveState.song.videoOffset ?? 0;
const targetTime = Math.max(
  0,
  (liveState.elapsedTime ?? 0) - videoOffset
);

  if (Math.abs(video.currentTime - targetTime) > 0.5) {
    video.currentTime = targetTime;
  }

  if (
  liveState.isPlaying &&
  (liveState.elapsedTime ?? 0) >= videoOffset
) {
  video.play().catch(() => {});
} else {
  video.pause();
}
}, [
  liveState.song?.id,
  liveState.song?.videoFile,
  liveState.song?.videoOffset,
  liveState.elapsedTime,
  liveState.isPlaying,
]);

useEffect(() => {
  const video = videoRef.current;
  const song = liveState.song;

  if (!video || !song?.videoFile) {
    return;
  }

  const videoPlaybackMode =
    song.videoPlaybackMode ?? "sync";

  if (
    videoPlaybackMode !== "loop" &&
    videoPlaybackMode !== "timed"
  ) {
    return;
  }

  video.loop = true;

  if (liveState.isPlaying) {
    video.play().catch(() => {});
  } else {
    video.pause();
  }
}, [
  liveState.song?.id,
  liveState.song?.videoFile,
  liveState.song?.videoPlaybackMode,
  liveState.isPlaying,
]);

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
  const song = liveState.song;

  if (
    !song ||
    song.videoPlaybackMode !== "timed" ||
    !liveState.isPlaying ||
    !song.videoDuration
  ) {
    return;
  }

  const actualElapsedTime =
    displayElapsedTime - LYRICS_LEAD;

  if (actualElapsedTime < song.videoDuration) {
    return;
  }

  setLyricsFinished(true);
}, [
  displayElapsedTime,
  liveState.isPlaying,
  liveState.song,
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
  const hasVideo = Boolean(liveState.song?.videoFile);

if (hasVideo && !liveState.playbackEnded) {
  return;
}
  if (
  liveState.playbackEnded &&
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
  const lastLyricTime =
  lyricLines.length > 0
    ? lyricLines[lyricLines.length - 1].time
    : 0;

const hideLastVideoLyric =
  currentSong?.videoMode === "video-lyrics" &&
  lyricLines.length > 0 &&
  displayElapsedTime - lastLyricTime >= 4;

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

const currentLyric =
  currentLineIndex >= 0
    ? lyricLines[currentLineIndex]
    : null;

const nextLyric =
  currentLineIndex >= 0 &&
  currentLineIndex < lyricLines.length - 1
    ? lyricLines[currentLineIndex + 1]
    : null;

const LONG_LYRICS_GAP = 8;
const LYRIC_VISIBLE_DURATION = 4;

const hideLyricDuringLongGap =
  currentLyric !== null &&
  nextLyric !== null &&
  nextLyric.time - currentLyric.time >= LONG_LYRICS_GAP &&
  displayElapsedTime - currentLyric.time >= LYRIC_VISIBLE_DURATION;

  const showWelcome =
  !currentSong ||
  liveState.mode === "pause" ||
  liveState.mode === "home" ||
  lyricsFinished;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {!audioUnlocked && (
  <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black">
    <button
      type="button"
      onClick={async () => {
        const audio = airGuitarAudioRef.current;

        if (audio) {
          audio.volume = 0;
          try {
            await audio.play();
            audio.pause();
            audio.currentTime = 0;
          } catch {
            // Le clic utilisateur sert à autoriser l'audio.
          }
          audio.volume = 1;
        }

        setAudioUnlocked(true);
      }}
      className="rounded-3xl border-2 border-emerald-400 bg-emerald-950/40 px-12 py-8 text-5xl font-black text-white"
    >
      ▶ DÉMARRER GB LIVE
    </button>
  </div>
)}

{liveState.mode === "air-guitar-tuto" ? (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black px-12 text-center">

    <video
      src="/Air-Guitar-Stage-V1.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 h-full w-full object-cover opacity-40"
    />
    

    <div className="relative z-10 w-full max-w-6xl">
      <p className="text-3xl font-black uppercase tracking-[0.35em] text-red-500">
        🎸 AIR GUITAR
      </p>

      <h1 className="mt-5 text-7xl font-black uppercase text-white">
        COMMENT JOUER ?
      </h1>

      <div className="mt-14 grid grid-cols-3 gap-8">

        <div
  className={`rounded-3xl border-2 border-white/30 bg-black/70 p-8 transition-all duration-700 ${
    airGuitarTutoStep >= 1
      ? "scale-100 opacity-100"
      : "scale-75 opacity-0"
  }`}
>
          <p className="text-7xl">🎸</p>
          <p className="mt-5 text-5xl font-black text-red-500">1</p>
          <p className="mt-4 text-3xl font-black uppercase text-white">
            Prends ta guitare...
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-300">
            invisible !
          </p>
        </div>

        <div
  className={`rounded-3xl border-2 border-white/30 bg-black/70 p-8 transition-all duration-700 ${
    airGuitarTutoStep >= 2
      ? "scale-100 opacity-100"
      : "scale-75 opacity-0"
  }`}
>
          <p className="text-7xl">🤘</p>
          <p className="mt-5 text-5xl font-black text-red-500">2</p>
          <p className="mt-4 text-3xl font-black uppercase text-white">
            Suis les défis
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-300">
            à l'écran !
          </p>
        </div>

        <div
  className={`rounded-3xl border-2 border-white/30 bg-black/70 p-8 transition-all duration-700 ${
    airGuitarTutoStep >= 3
      ? "scale-100 opacity-100"
      : "scale-75 opacity-0"
  }`}
>
          <p className="text-7xl">🔥</p>
          <p className="mt-5 text-5xl font-black text-red-500">3</p>
          <p className="mt-4 text-3xl font-black uppercase text-white">
            Donne tout
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-300">
            pour le public !
          </p>
        </div>

      </div>

      <p className="mt-14 animate-pulse text-4xl font-black uppercase tracking-[0.15em] text-white">
        PRÊT À DEVENIR UNE ROCK STAR ?
      </p>
    </div>
  </div>

) : liveState.mode === "air-guitar" ? (

  <div className="relative h-full w-full overflow-hidden bg-black">
    <video
      src="/Air-Guitar-Intro-Loop-V1.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover"
    />

    <audio
    ref={airGuitarAudioRef}
  src="/Air-Guitar-Waiting-Loop.mp3"
  autoPlay
  loop
/>

    <div className="pointer-events-none absolute inset-x-0 bottom-12 text-center">
      <p className="text-2xl font-black uppercase tracking-[0.35em] text-white drop-shadow-2xl">
        QUI SERA LA PROCHAINE ROCK STAR ?
      </p>
    </div>
  </div>

) : (
  liveState.mode === "air-guitar-ready" ||
  liveState.mode === "air-guitar-challenge" ||
  liveState.mode === "air-guitar-finale" ||
liveState.mode === "air-guitar-applause" ||
liveState.mode === "air-guitar-score"
) ? (
  <div className="flex h-full w-full flex-col items-center justify-center bg-black text-center">
        {airGuitarCountdown === "rock" ||
liveState.mode === "air-guitar-challenge" ||
liveState.mode === "air-guitar-finale" ||
liveState.mode === "air-guitar-applause" ||
liveState.mode === "air-guitar-score" ? (
  <div className="relative h-full w-full overflow-hidden bg-black">
    <video
      src="/Air-Guitar-Stage-V1.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover"
    />
{airGuitarSong &&
  (liveState.mode === "air-guitar-ready" ||
    liveState.mode === "air-guitar-challenge" ||
    liveState.mode === "air-guitar-finale") && (
    <audio
  ref={airGuitarSongRef}
  src={airGuitarSong ?? liveState.message}
  autoPlay
/>
  )}
    {airGuitarChallenge && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 px-12">
        <div className="rounded-3xl border-4 border-white bg-black/75 px-16 py-10 text-center shadow-2xl">
          <p className="animate-pulse text-7xl font-black uppercase text-white drop-shadow-2xl">
            {airGuitarChallenge}
          </p>
        </div>
      </div>
    )}

{liveState.mode === "air-guitar-finale" && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/25 px-12">
    <div className="text-center">
      <p className="animate-pulse text-[8rem] leading-none">
        🤘🔥🎸
      </p>

      <h1 className="mt-8 text-[7rem] font-black uppercase leading-none text-white drop-shadow-2xl">
        FINALE
      </h1>

      <p className="mt-5 text-6xl font-black uppercase text-red-500 drop-shadow-2xl">
        DE ROCK STAR !
      </p>

      <p className="mt-10 text-3xl font-bold uppercase tracking-[0.25em] text-white">
        DONNE TOUT !
      </p>
    </div>
  </div>
)}

{liveState.mode === "air-guitar-applause" && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 px-12">
    <div className="text-center">
      <p className="text-[9rem] leading-none animate-pulse">
        👏
      </p>

      <p className="mt-6 text-4xl font-black uppercase tracking-[0.35em] text-red-500">
        APPLAUDIMÈTRE
      </p>

      <h1 className="mt-8 text-[7rem] font-black uppercase leading-none text-white drop-shadow-2xl">
        FAITES DU BRUIT !
      </h1>

      <p className="mt-10 text-3xl font-bold uppercase tracking-[0.2em] text-white">
        Quel niveau pour notre guitariste ?
      </p>
    </div>
  </div>
)}

{liveState.mode === "air-guitar-score" && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 px-12">
    <div className="text-center">

      {liveState.message === "rocker" && (
        <>
          <p className="text-[10rem] leading-none">🎸</p>

          <h1 className="mt-6 text-[8rem] font-black uppercase leading-none text-white drop-shadow-2xl">
            ROCKER
          </h1>

          <p className="mt-8 text-4xl font-black uppercase tracking-[0.25em] text-red-500">
            ÇA ENVOIE !
          </p>
        </>
      )}

      {liveState.message === "guitar-hero" && (
        <>
          <p className="animate-pulse text-[10rem] leading-none">
            🔥🎸🔥
          </p>

          <h1 className="mt-6 text-[7rem] font-black uppercase leading-none text-white drop-shadow-2xl">
            GUITAR HERO
          </h1>

          <p className="mt-8 text-4xl font-black uppercase tracking-[0.25em] text-red-500">
            LE PUBLIC EST EN FEU !
          </p>
        </>
      )}

      {liveState.message === "legende" && (
        <>
          <p className="animate-bounce text-[10rem] leading-none">
            👑
          </p>

          <h1 className="mt-4 text-[7rem] font-black uppercase leading-none text-white drop-shadow-2xl">
            LÉGENDE
          </h1>

          <p className="mt-3 text-[5rem] font-black uppercase leading-none text-red-500 drop-shadow-2xl">
            DU ROCK
          </p>

          <p className="mt-10 animate-pulse text-4xl font-black uppercase tracking-[0.2em] text-white">
            ENTRÉE DANS LA LÉGENDE !
          </p>

          <div className="mt-8 text-6xl">
            🔥 🤘 🎸 🤘 🔥
          </div>
        </>
      )}

    </div>
  </div>
)}

  </div>
) : (
      <>
        <p className="text-3xl font-bold uppercase tracking-[0.35em] text-red-500">
          AIR GUITAR
        </p>

        <p className="mt-8 text-[14rem] font-black leading-none text-white">
          {airGuitarCountdown}
        </p>
      </>
    )}
  </div>

) : liveState.mode === "coup-parfait-success" ? (
  <div className="flex h-full w-full flex-col items-center justify-center bg-black px-12 text-center">
    <p className="animate-bounce text-[12rem] leading-none">
  🎉
</p>

    <h1 className="mt-8 animate-pulse text-8xl font-black text-emerald-400">
      COUP PARFAIT !
    </h1>

    <p className="mt-8 text-4xl font-bold text-white">
      🥁 INCROYABLE !
    </p>
  </div>
) : liveState.mode === "coup-parfait-fail" ? (
  <div className="flex h-full w-full flex-col items-center justify-center bg-black px-12 text-center">
    <p className="animate-bounce text-[12rem] leading-none">
  😬
</p>

    <h1 className="mt-8 animate-pulse text-8xl font-black text-red-500">
      RATÉ !
    </h1>

    <p className="mt-8 text-4xl font-bold text-white">
      Presque... mais pas cette fois !
    </p>
  </div>
) : liveState.mode === "coup-parfait-ready" ? (
  <div className="flex h-full w-full flex-col items-center justify-center bg-black text-center">
    {coupParfaitCountdown === "go" ? (
      coupParfaitVideoEnded ? (
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <p className="text-8xl font-black text-orange-400">
            🥁 ALORS ?
          </p>

          <p className="mt-10 text-5xl font-bold text-white">
            COUP PARFAIT OU RATÉ ?
          </p>
        </div>
      ) : (
        <video
          ref={coupParfaitSongVideoRef}
          src="/Le-Coup-Parfait-Morceau-V1.mp4"
          autoPlay
          playsInline
          onPlay={(event) => {
            event.currentTarget.volume = liveState.videoVolume ?? 0.25;
          }}
          onEnded={() => {
            setCoupParfaitVideoEnded(true);
          }}
          className="h-full w-full object-contain"
        />
      )
    ) : (
      <>
        <p className="text-3xl font-bold uppercase tracking-[0.3em] text-orange-400">
          LE COUP PARFAIT
        </p>

        <p className="mt-8 text-[14rem] font-black leading-none text-white">
          {coupParfaitCountdown}
        </p>
      </>
    )}
  </div>
  ) : liveState.mode === "coup-parfait" ? (
  <div className="flex h-full w-full flex-col items-center justify-center bg-black px-12 text-center">
    <p className="text-3xl font-bold uppercase tracking-[0.35em] text-orange-400">
      G3 LIVE PRÉSENTE
    </p>

    <h1 className="mt-8 text-8xl font-black text-white">
      🥁 LE COUP PARFAIT
    </h1>

    <p className="mt-10 text-5xl font-bold text-orange-400">
      UNE BAGUETTE. UN TOM. UN SEUL COUP.
    </p>

    <p className="mt-14 text-3xl text-zinc-300">
      Qui réussira le coup parfait ?
    </p>
  </div>
) : liveState.mode === "coup-parfait-tuto" ? (
  <div className="h-full w-full overflow-hidden bg-black">
    <video
      ref={coupParfaitVideoRef}
  src="/Le-Coup-Parfait-Tuto-V1.mp4"
  autoPlay
    playsInline
    onEnded={() => {
    void fetch("/api/live-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "home",
      }),
    });
  }}
  className="h-full w-full object-contain"
/>
  </div>
) : showWelcome ? (
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
      src={liveState.djVideoFile}
      autoPlay
      loop={liveState.djLoop}
      muted
      playsInline
      className="h-full w-full object-cover"
    />
  </div>
) : currentSong.videoFile && currentSong.videoMode === "video" ? (
  <div className="h-full w-full overflow-hidden bg-black">
    <video
      ref={videoRef}
      src={currentSong.videoFile}
      muted
      playsInline
      preload="auto"
      className="h-full w-full object-contain"
    />
  </div>
) : currentSong.videoFile && currentSong.videoMode === "video-lyrics" ? (
  <div className="relative h-full w-full overflow-hidden bg-black">
    <video
      ref={videoRef}
      src={currentSong.videoFile}
      muted
      playsInline
      preload="auto"
      className="h-full w-full object-contain"
    />

    <div className="absolute inset-x-0 bottom-0 px-16 pb-14 pt-32 text-center">
      {lyricLines.map((line, index) => {
        const distance = index - currentLineIndex;

        if (currentLineIndex === -1) {
          return null;
        }
        if (
  index === lyricLines.length - 1 &&
  hideLastVideoLyric
) {
  return null;
}

        if (distance < 0 || distance > 1) {
  return null;
}

        const isCurrent = distance === 0;
        const isPast = distance < 0;
        if (isCurrent && hideLyricDuringLongGap) {
  return null;
}

        return (
          <div
            key={`${line.time}-${index}`}
            className={`py-3 font-bold leading-tight drop-shadow-[0_3px_6px_rgba(0,0,0,1)] transition-all duration-300 ${
              isCurrent
                ? "text-6xl text-white"
                : isPast
                  ? "text-3xl text-zinc-300"
                  : "text-4xl text-zinc-300"
            }`}
          >
            {line.text}
          </div>
        );
      })}
    </div>
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
                  if (distance < 0 || distance > 2) {
  return null;
}

                  const isCurrent = distance === 0;
                  const isPast = distance < 0;
                  if (isCurrent && hideLyricDuringLongGap) {
  return null;
}

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

      {isMessageVisible &&
  liveState.message &&
  !liveState.mode.startsWith("air-guitar") && (
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













