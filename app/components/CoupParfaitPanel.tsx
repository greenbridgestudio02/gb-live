"use client";
import { useState } from "react";

export default function CoupParfaitPanel({
  onClose,
  onShowTuto,
  onStartChallenge,
  onPlayerReady,
  onSuccess,
onFail,
onNextPlayer,
}: {
  onClose: () => void;
  onShowTuto: (volume: number) => void;
  onStartChallenge: (volume: number) => void;
  onPlayerReady: (volume: number) => void;
  onSuccess: () => void;
onFail: () => void;
onNextPlayer: () => void;
}) {
   const [challengeStarted, setChallengeStarted] = useState(false); 
   const [playerReady, setPlayerReady] = useState(false);
   const [resultShown, setResultShown] = useState(false);
   const [videoVolume, setVideoVolume] = useState(0.25);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-orange-700 bg-zinc-950 p-8 shadow-2xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            G3 Live
          </p>

          <h2 className="mt-3 text-4xl font-black">
            🥁 LE COUP PARFAIT
          </h2>

          <p className="mt-3 text-zinc-400">
            Une baguette. Un tom. Un seul coup.
          </p>
          <div className="mt-6">
  <div className="flex items-center justify-between">
    <span className="text-sm font-semibold text-zinc-300">
      Volume vidéo
    </span>

    <span className="text-sm font-bold text-orange-400">
      {Math.round(videoVolume * 100)} %
    </span>
  </div>

  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={videoVolume}
    onChange={(event) =>
      setVideoVolume(Number(event.target.value))
    }
    className="mt-3 w-full"
  />
</div>
        </div>

        <div className="mt-8 grid gap-4">
  {!challengeStarted ? (
    <>
      <button
        type="button"
        onClick={() => onShowTuto(videoVolume)}
        className="rounded-2xl border border-zinc-600 bg-zinc-900 px-6 py-5 text-xl font-bold hover:bg-zinc-800"
      >
        ▶ VOIR LE TUTO
      </button>

      <button
        type="button"
        onClick={() => {
          setChallengeStarted(true);
          onStartChallenge(videoVolume);
        }}
        className="rounded-2xl bg-orange-500 px-6 py-6 text-2xl font-black text-black hover:bg-orange-400"
      >
        🔥 LANCER LE DÉFI
      </button>
    </>
  ) : (
    <>
      <div className="rounded-2xl border border-orange-800 bg-orange-950/30 p-5 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
          Défi en cours
        </p>
        <p className="mt-2 text-2xl font-black">
          Prépare le prochain joueur
        </p>
      </div>

      {resultShown ? (
  <button
    type="button"
    onClick={() => {
      setResultShown(false);
      setPlayerReady(false);
      onNextPlayer();
    }}
    className="rounded-2xl bg-orange-500 px-6 py-6 text-2xl font-black text-black hover:bg-orange-400"
  >
    ➡️ JOUEUR SUIVANT
  </button>
) : !playerReady ? (
  <button
    type="button"
    onClick={() => {
      setPlayerReady(true);
      onPlayerReady(videoVolume);
    }}
    className="rounded-2xl bg-emerald-500 px-6 py-6 text-2xl font-black text-black hover:bg-emerald-400"
  >
    🥁 JOUEUR PRÊT
  </button>
) : (
  <div className="grid grid-cols-2 gap-4">
    <button
      type="button"
      onClick={() => {
  setResultShown(true);
  onSuccess();
}}
      className="rounded-2xl bg-emerald-500 px-4 py-6 text-xl font-black text-black hover:bg-emerald-400"
    >
      ✅ COUP PARFAIT !
    </button>

    <button
      type="button"
      onClick={() => {
  setResultShown(true);
  onFail();
}}
      className="rounded-2xl bg-red-600 px-4 py-6 text-xl font-black text-white hover:bg-red-500"
    >
      ❌ RATÉ !
    </button>
  </div>
)}
    </>
  )}

  <button
    type="button"
    onClick={onClose}
    className="mt-2 rounded-xl border border-zinc-700 px-6 py-4 font-semibold text-zinc-300 hover:bg-zinc-900"
  >
    Fermer
  </button>
</div>
      </div>
          </div>
  );
}