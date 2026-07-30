type TransportProps = {
  currentSongIndex: number;
  totalSongs: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function Transport({
  currentSongIndex,
  totalSongs,
  onPrevious,
  onNext,
}: TransportProps) {
  const isFirstSong = currentSongIndex === 0;
  const isLastSong = currentSongIndex === totalSongs - 1;

  return (
    <div className="mt-6 grid grid-cols-3 gap-5">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstSong}
        className="rounded-2xl border border-zinc-700 bg-zinc-900 px-8 py-6 text-xl font-semibold transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-zinc-900"
      >
        ◀ Précédent
      </button>

      <button
        type="button"
        className="rounded-2xl bg-emerald-500 px-8 py-6 text-2xl font-bold text-zinc-950 transition hover:bg-emerald-400"
      >
        ▶ Lancer
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLastSong}
        className="rounded-2xl border border-zinc-700 bg-zinc-900 px-8 py-6 text-xl font-semibold transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-zinc-900"
      >
        Suivant ▶
      </button>
    </div>
  );
}