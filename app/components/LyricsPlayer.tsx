"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Song } from "../../types/show";

type LyricsPlayerProps = {
  song: Song;
  stopped?: boolean;
  publicScreenHidden?: boolean;
};

export default function LyricsPlayer({
  song,
  stopped = false,
  publicScreenHidden = false,
}: LyricsPlayerProps) { 
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const pausedElapsedRef = useRef(0);
  const lastServerUpdateRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume =
      song.audioVolume ?? 1;
  }
}, [song.audioVolume, song.audioFile]);
  const lastMidiTriggerRef = useRef(0);
  const midiCheckInFlightRef = useRef(false);
  const isPlayingRef = useRef(false);
  const [audioArmed, setAudioArmed] = useState(false);

  const isInstrumental = song.kind === "instrumental";
  const lyricLines = song.lyricLines ?? [];

  const hasSynchronizedLyrics =
    lyricLines.length > 0 && !song.needsLyricsSync;
    const hasLiveVideo =
  isInstrumental &&
  Boolean(song.videoFile) &&
  !song.audioFile;

  const currentLineIndex = useMemo(() => {
    if (lyricLines.length === 0) {
      return -1;
    }

    let activeIndex = 0;

    for (let index = 0; index < lyricLines.length; index++) {
      if (elapsedTime >= lyricLines[index].time) {
        activeIndex = index;
      } else {
        break;
      }
    }

    return activeIndex;
  }, [elapsedTime, lyricLines]);

  const previousLine =
    currentLineIndex > 0
      ? lyricLines[currentLineIndex - 1]
      : null;

  const currentLine =
    currentLineIndex >= 0
      ? lyricLines[currentLineIndex]
      : null;

  const nextLine =
    currentLineIndex >= 0 &&
    currentLineIndex < lyricLines.length - 1
      ? lyricLines[currentLineIndex + 1]
      : null;

useEffect(() => {
  if (!stopped) {
    return;
  }
isPlayingRef.current = false;
  setIsPlaying(false);

  pausedElapsedRef.current = elapsedTime;
  startTimeRef.current = null;

  if (audioRef.current) {
    audioRef.current.pause();
  }
}, [stopped]);


  async function sendLiveState(
  time: number,
  playing: boolean,
  playbackEnded = false,
  forceHome = false
) {
    try {
      await fetch("/api/live-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          mode: forceHome
  ? "home"
  : playing
    ? "song"
    : undefined,

          song: {
            id: song.id,
            title: song.title,
            kind: song.kind ?? "vocal",
            lyrics: song.lyrics,
            lyricLines: song.lyricLines ?? [],
            videoFile: song.videoFile,
            videoMode: song.videoMode,
            videoOffset: song.videoOffset,
            videoPlaybackMode: song.videoPlaybackMode,
videoDuration: song.videoDuration,
            needsLyricsSync:
              song.needsLyricsSync === true,
          },
          
          elapsedTime: time,
          isPlaying: playing,
          playbackEnded,
        }),
      });
    } catch (error) {
      console.error(
        "Impossible d’envoyer l’état vers l’écran public.",
        error
      );
    }
  }

  // Changement de morceau : remise à zéro
  // et envoi immédiat au serveur.
  useEffect(() => {
  isPlayingRef.current = false;
  setIsPlaying(false);
  setElapsedTime(0);

    startTimeRef.current = null;
    pausedElapsedRef.current = 0;
    lastServerUpdateRef.current = 0;
    fetch("/api/midi-trigger", {
  cache: "no-store",
})
  .then((response) => response.json())
  .then((event) => {
    if (typeof event.timestamp === "number") {
      lastMidiTriggerRef.current = event.timestamp;
    }
  })
  .catch(() => {});
    if (audioRef.current) {
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
  audioRef.current.load();
}

    localStorage.setItem(
      "g3-live-public-elapsed-time",
      "0"
    );

    void sendLiveState(0, false, false, true);
  }, [song.id]);

  // Sauvegarde locale de secours.
  useEffect(() => {
    localStorage.setItem(
      "g3-live-public-elapsed-time",
      String(elapsedTime)
    );
  }, [elapsedTime]);

  // Envoi régulier au serveur pendant la lecture.
  useEffect(() => {
    if (!isPlaying || stopped || publicScreenHidden) {
  return;
}

    const now = performance.now();

    if (now - lastServerUpdateRef.current < 200) {
      return;
    }

    lastServerUpdateRef.current = now;

    void sendLiveState(
      elapsedTime,
      true
    );
  }, [
  elapsedTime,
  isPlaying,
  song.id,
  stopped,
  publicScreenHidden,
]);

  // Chronomètre.
  useEffect(() => {
  if (!isPlaying) {
    return;
  }

  let animationFrameId: number;

  function update() {
    if (song.audioFile && audioRef.current) {
      setElapsedTime(audioRef.current.currentTime);
    } else if (startTimeRef.current !== null) {
      const elapsed =
        pausedElapsedRef.current +
        (performance.now() - startTimeRef.current) / 1000;

      setElapsedTime(elapsed);
    }

    animationFrameId =
      requestAnimationFrame(update);
  }

  animationFrameId =
    requestAnimationFrame(update);

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}, [isPlaying, song.audioFile]);
async function armAudio() {
  if (!song.audioFile || !audioRef.current) {
    return;
  }

  try {
    const audio = audioRef.current;

    const previousMuted = audio.muted;

    audio.muted = true;
    audio.currentTime = 0;

    await audio.play();

    audio.pause();
    audio.currentTime = 0;
    audio.muted = previousMuted;

    setElapsedTime(0);
    pausedElapsedRef.current = 0;
    setAudioArmed(true);
  } catch (error) {
    console.error(
      "Impossible d'armer l'audio.",
      error
    );
  }
}
useEffect(() => {
  if (
    !hasLiveVideo ||
    song.videoPlaybackMode !== "timed" ||
    !song.videoDuration ||
    !isPlaying ||
    elapsedTime < song.videoDuration
  ) {
    return;
  }

  isPlayingRef.current = false;
  setIsPlaying(false);

  startTimeRef.current = null;
  pausedElapsedRef.current = 0;
  setElapsedTime(0);

  void sendLiveState(
    song.videoDuration,
    false,
    true,
    true
  );
}, [
  elapsedTime,
  hasLiveVideo,
  isPlaying,
  song.videoDuration,
  song.videoPlaybackMode,
]);

  async function togglePlayback() {
  if (!hasSynchronizedLyrics && !hasLiveVideo) {
  return;
}

  if (isPlayingRef.current) {
    if (song.audioFile && audioRef.current) {
      audioRef.current.pause();

      const audioTime =
        audioRef.current.currentTime;

      setElapsedTime(audioTime);
      pausedElapsedRef.current = audioTime;
    } else {
  if (hasLiveVideo) {
    pausedElapsedRef.current = 0;
    setElapsedTime(0);
  } else {
    pausedElapsedRef.current = elapsedTime;
  }
}

    startTimeRef.current = null;

    isPlayingRef.current = false;
    setIsPlaying(false);

    void sendLiveState(
  song.audioFile && audioRef.current
    ? audioRef.current.currentTime
    : elapsedTime,
  false,
  false,
  hasLiveVideo
);

    return;
  }

  if (song.audioFile && audioRef.current) {
    audioRef.current.currentTime =
      elapsedTime;

    try {
      await audioRef.current.play();
      
    } catch (error) {
      console.error(
        "Impossible de lancer le fichier audio.",
        error
      );

      return;
    }
  } else {
    startTimeRef.current =
      performance.now();
  }

  isPlayingRef.current = true;
  setIsPlaying(true);

  void sendLiveState(
    elapsedTime,
    true
  );
}

  

  function resetLyrics() {
  isPlayingRef.current = false;
  setIsPlaying(false);
  setElapsedTime(0);

    startTimeRef.current = null;
    pausedElapsedRef.current = 0;
    if (audioRef.current) {
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
}

    void sendLiveState(
      0,
      false
    );
  }

useEffect(() => {
  isPlayingRef.current = isPlaying;
}, [isPlaying]);

useEffect(() => {
  let stopped = false;

  async function checkMidiTrigger() {
  if (midiCheckInFlightRef.current) {
    return;
  }

  midiCheckInFlightRef.current = true;

  try {
      const response = await fetch(
        "/api/midi-trigger",
        {
          cache: "no-store",
        }
      );

      if (!response.ok || stopped) {
        return;
      }

      const event = await response.json();

      if (
        (event.type !== "play" && event.type !== "pause") ||
        typeof event.timestamp !== "number" ||
        event.timestamp <= lastMidiTriggerRef.current
      ) {
        return;
      }

      lastMidiTriggerRef.current =
  event.timestamp;





if (
  (event.type === "play" && !isPlayingRef.current) ||
  (event.type === "pause" && isPlayingRef.current)
) {
  void togglePlayback();
}
    } catch {
  // Listener MIDI temporairement indisponible.
} finally {
  midiCheckInFlightRef.current = false;
}
  }

  const intervalId = window.setInterval(
    () => {
      void checkMidiTrigger();
    },
    25
  );

  return () => {
    stopped = true;
    window.clearInterval(intervalId);
  };
}, [
  hasSynchronizedLyrics,
  song.id,
  song.audioFile,
]);
  // BLUETURN
  // Pédale gauche = ArrowLeft = lecture / pause des paroles.
  useEffect(() => {
    function handleExternalControl(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft") {
        return;
      }

      const target = event.target as HTMLElement | null;

      // Ne pas déclencher la pédale pendant une saisie.
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      // Une seule action par pression.
      if (event.repeat) {
        return;
      }

      event.preventDefault();

      togglePlayback();
    }

    window.addEventListener(
      "keydown",
      handleExternalControl
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleExternalControl
      );
    };
  }, [
    isPlaying,
    elapsedTime,
    hasSynchronizedLyrics,
    song.id,
  ]);

  // MORCEAU INSTRUMENTAL
  if (isInstrumental) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="w-full max-w-4xl text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">
                🎹
              </span>

              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
                  Instrumental
                </p>

                <h3 className="mt-1 text-4xl font-bold text-zinc-100">
                  {song.title}
                </h3>
              </div>
            </div>

            {(song.bpm || song.key) && (
              <div className="mt-4 flex items-center justify-center gap-6 text-lg text-zinc-400">
                {song.bpm && (
                  <span>
                    ♩ {song.bpm} BPM
                  </span>
                )}

                {song.key && (
                  <span>
                    Tonalité : {song.key}
                  </span>
                )}
              </div>
            )}

            <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Notes de scène
              </p>

              {song.stageNotes.trim() ? (
                <p className="mt-3 whitespace-pre-line text-xl font-medium leading-relaxed text-zinc-300">
                  {song.stageNotes}
                </p>
              ) : (
                <p className="mt-3 text-base text-zinc-600">
                  Aucune note de scène pour ce morceau.
                </p>
              )}
            </div>
          </div>
                      {hasLiveVideo && (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => void togglePlayback()}
                  disabled={isPlaying}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white disabled:opacity-40"
                >
                  ASSIGN 1 — PLAY
                </button>

                <button
                  type="button"
                  onClick={() => void togglePlayback()}
                  disabled={!isPlaying}
                  className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white disabled:opacity-40"
                >
                  ASSIGN 2 — STOP
                </button>
              </div>
            )}
        </div>
      </div>
    );
  }

  // MORCEAU CHANTÉ NON SYNCHRONISÉ
  if (!hasSynchronizedLyrics) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="mb-3 shrink-0 rounded-xl border border-amber-700 bg-amber-950/40 px-4 py-2 text-center">
            <p className="font-bold text-amber-300">
              ⚠ Paroles à synchroniser
            </p>

            <p className="mt-1 text-sm text-amber-200/70">
              Préparation → Synchroniser les paroles
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
            <div className="whitespace-pre-line text-center text-2xl font-medium leading-relaxed text-zinc-300">
              {song.lyrics ||
                "Aucune parole enregistrée."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MORCEAU CHANTÉ SYNCHRONISÉ
  return (
    <div className="flex h-full min-h-0 flex-col">
      {song.audioFile && (
        <div className="mb-2 flex h-10 shrink-0 items-center">
          <audio
            ref={audioRef}
            src={song.audioFile}
            preload="auto"
            controls
            className="h-10 w-full max-w-md"
            onEnded={() => {
              const finalTime =
                audioRef.current?.currentTime ?? elapsedTime;

              setElapsedTime(finalTime);
              pausedElapsedRef.current = finalTime;
              startTimeRef.current = null;
              isPlayingRef.current = false;
              setIsPlaying(false);

              void sendLiveState(
                finalTime,
                false,
                true
              );
            }}
          />
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-[2fr_3fr] gap-3">
        <div className="min-h-0 overflow-y-auto rounded-2xl border border-zinc-600 bg-zinc-900/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Notes de scène
          </p>

          {song.stageNotes?.trim() ? (
            <div className="mt-3 whitespace-pre-line text-lg font-medium leading-relaxed text-zinc-200">
              {song.stageNotes}
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">
              Aucune note de scène pour ce morceau.
            </p>
          )}
        </div>

        <div className="flex min-h-0 items-center justify-center rounded-2xl border border-zinc-600 bg-zinc-900/40 p-4">
          <div className="w-full text-center">
            <div className="min-h-14">
              {previousLine && (
                <p className="text-lg font-medium leading-relaxed text-zinc-600">
                  {previousLine.text}
                </p>
              )}
            </div>

            <div className="my-4 flex min-h-28 items-center justify-center">
              {currentLine && (
                <p className="text-4xl font-bold leading-tight text-emerald-300 transition-all duration-300">
                  {currentLine.text}
                </p>
              )}
            </div>

            <div className="min-h-14">
              {nextLine ? (
                <p className="text-xl font-medium leading-relaxed text-zinc-400">
                  {nextLine.text}
                </p>
              ) : (
                <p className="text-lg font-medium text-zinc-600">
                  Fin des paroles
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex h-10 shrink-0 items-center justify-center gap-2">
        <button
          type="button"
          onClick={togglePlayback}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-zinc-950"
        >
          {isPlaying ? "⏸ Paroles" : "▶ Paroles"}
        </button>

        <button
          type="button"
          onClick={resetLyrics}
          disabled={elapsedTime === 0}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold disabled:opacity-30"
        >
          ↺ Début
        </button>

        <div className="min-w-16 text-center text-xs tabular-nums text-zinc-500">
          {elapsedTime.toFixed(1)} s
        </div>
      </div>
    </div>
  );
}



