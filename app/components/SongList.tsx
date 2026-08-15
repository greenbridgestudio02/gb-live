import type { Song } from "../../types/show";

type SongListProps = {
  songs: Song[];
  currentSongIndex: number;
  onSelectSong: (index: number) => void;
  onClose: () => void;
};

export default function SongList({
  songs,
  currentSongIndex,
  onSelectSong,
  onClose,
}: SongListProps) {
  function selectSong(index: number) {
    onSelectSong(index);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-black/70">
      <aside className="flex h-full w-full max-w-md flex-col border-r border-zinc-700 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              GreenBridge Live
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Setlist
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-2xl font-bold transition hover:bg-zinc-800"
            aria-label="Fermer la setlist"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {songs.map((song, index) => {
              const actif = index === currentSongIndex;
              const dejaJoue = index < currentSongIndex;

              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => selectSong(index)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                    actif
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-transparent bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`w-7 text-center text-lg font-bold ${
                      actif
                        ? "text-emerald-400"
                        : dejaJoue
                          ? "text-zinc-400"
                          : "text-zinc-600"
                    }`}
                  >
                    {actif ? "▶" : dejaJoue ? "✓" : ""}
                  </span>

                  <span className="text-sm font-semibold text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-semibold">
                      {song.title}
                    </span>

                    <span className="mt-1 block text-xs text-zinc-500">
                      {song.duration}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-lg font-semibold transition hover:bg-zinc-800"
          >
            Fermer
          </button>
        </div>
      </aside>

      <button
        type="button"
        onClick={onClose}
        className="flex-1"
        aria-label="Fermer la setlist"
      />
    </div>
  );
}