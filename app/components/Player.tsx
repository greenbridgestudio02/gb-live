import type { Song } from "../../types/show";

type PlayerProps = {
  song: Song;
};

export default function Player({ song }: PlayerProps) {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
      <div className="flex items-start justify-between">
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

      <div className="mt-10 grid grid-cols-2 gap-5">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Notes de scène
          </p>

          <p className="mt-4 text-lg leading-8 text-zinc-300">
            {song.stageNotes}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Prochaine action
          </p>

          <p className="mt-4 text-lg leading-8 text-zinc-300">
            {song.nextAction}
          </p>
        </article>
      </div>

      <div className="mt-auto pt-10">
        <div className="mb-3 flex justify-between text-sm text-zinc-500">
          <span>00:00</span>
          <span>{song.duration}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-[18%] rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}