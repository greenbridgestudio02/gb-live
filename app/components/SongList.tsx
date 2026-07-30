const morceaux = [
  { numero: "01", titre: "Ouverture", duree: "03:20", actif: true },
  { numero: "02", titre: "Mon amour", duree: "04:15", actif: false },
  { numero: "03", titre: "Entre deux rives", duree: "05:05", actif: false },
  { numero: "04", titre: "Le pont", duree: "04:40", actif: false },
  { numero: "05", titre: "Final", duree: "06:10", actif: false },
];

export default function SongList() {
  return (
    <aside className="w-80 border-r border-zinc-800 bg-zinc-900/60 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Morceaux
        </h2>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
          5 titres
        </span>
      </div>

      <div className="space-y-2">
        {morceaux.map((morceau) => (
          <button
            key={morceau.numero}
            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
              morceau.actif
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-transparent bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800"
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                morceau.actif ? "text-emerald-400" : "text-zinc-600"
              }`}
            >
              {morceau.numero}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold">
                {morceau.titre}
              </span>

              <span className="mt-1 block text-xs text-zinc-500">
                {morceau.duree}
              </span>
            </span>

            {morceau.actif && (
              <span className="text-xl text-emerald-400">▶</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}