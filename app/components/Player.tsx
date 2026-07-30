import type { Song } from "../../types/show";

type PlayerProps = {
  song: Song;
};

export default function Player({ song }: PlayerProps) {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div className="flex items-start justify-between gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Morceau en cours
          </p>

          <h2 className="mt-4 text-5xl font-bold tracking-tight">
            {song.title}
          </h2>

          <p className="mt-3 text-lg text-zinc-400">
            {song.description}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Durée
          </p>

          <p className="mt-1 text-3xl font-bold tabular-nums">
            {song.duration}
          </p>
        </div>
      </div>

      <section className="mt-8 flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Paroles
        </p>

        <div className="mt-6 whitespace-pre-line text-2xl font-medium leading-relaxed text-zinc-100">
          {song.lyrics}
        </div>
      </section>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Note de scène
        </p>

        <p className="mt-2 text-sm text-zinc-300">
          {song.stageNotes}
        </p>
      </div>
    </div>
  );
}