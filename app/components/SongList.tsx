import type { Song } from "../../types/show";

type SongListProps = {
  songs: Song[];
};

export default function SongList({ songs }: SongListProps) {
  return (
    <aside className="w-80 border-r border-zinc-800 bg-zinc-900/60 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Morceaux
        </h2>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
          {songs.length} titres
        </span>
      </div>

      <div className="space-y-2">
        {songs.map((song, index) => {
          const actif = index === 0;

          return (
            <button
              key={song.id}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                actif
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-transparent bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  actif ? "text-emerald-400" : "text-zinc-600"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">
                  {song.title}
                </span>

                <span className="mt-1 block text-xs text-zinc-500">
                  {song.duration}
                </span>
              </span>

              {actif && (
                <span className="text-xl text-emerald-400">▶</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}