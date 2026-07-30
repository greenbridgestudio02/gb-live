const morceaux = [
  { numero: "01", titre: "Ouverture", duree: "03:20", actif: true },
  { numero: "02", titre: "Mon amour", duree: "04:15", actif: false },
  { numero: "03", titre: "Entre deux rives", duree: "05:05", actif: false },
  { numero: "04", titre: "Le pont", duree: "04:40", actif: false },
  { numero: "05", titre: "Final", duree: "06:10", actif: false },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Barre supérieure */}
      <header className="flex h-20 items-center justify-between border-b border-zinc-800 px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            GreenBridge Studio
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            GreenBridge Live
          </h1>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Spectacle
          </p>

          <p className="mt-1 text-lg font-semibold">Pont-Avert Live</p>
        </div>
      </header>

      {/* Zone principale */}
      <div className="flex flex-1">
        {/* Liste des morceaux */}
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

        {/* Morceau sélectionné */}
        <section className="flex flex-1 flex-col p-8">
          <div className="flex flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                  Morceau en cours
                </p>

                <h2 className="mt-4 text-5xl font-bold tracking-tight">
                  Ouverture
                </h2>

                <p className="mt-3 text-lg text-zinc-400">
                  Introduction du spectacle
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-center">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Durée
                </p>

                <p className="mt-1 text-3xl font-bold tabular-nums">03:20</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-5">
              <article className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Notes de scène
                </p>

                <p className="mt-4 text-lg leading-8 text-zinc-300">
                  Commencer au piano seul. Laisser respirer l’introduction avant
                  de lancer les éléments visuels.
                </p>
              </article>

              <article className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Prochaine action
                </p>

                <p className="mt-4 text-lg leading-8 text-zinc-300">
                  Déclencher l’ambiance lumineuse et préparer le morceau
                  « Mon amour ».
                </p>
              </article>
            </div>

            <div className="mt-auto pt-10">
              <div className="mb-3 flex justify-between text-sm text-zinc-500">
                <span>00:00</span>
                <span>03:20</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-[18%] rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Commandes principales */}
          <div className="mt-6 grid grid-cols-3 gap-5">
            <button className="rounded-2xl border border-zinc-700 bg-zinc-900 px-8 py-6 text-xl font-semibold transition hover:bg-zinc-800">
              ◀ Précédent
            </button>

            <button className="rounded-2xl bg-emerald-500 px-8 py-6 text-2xl font-bold text-zinc-950 transition hover:bg-emerald-400">
              ▶ Lancer
            </button>

            <button className="rounded-2xl border border-zinc-700 bg-zinc-900 px-8 py-6 text-xl font-semibold transition hover:bg-zinc-800">
              Suivant ▶
            </button>
          </div>
        </section>
      </div>

      {/* Barre d’état */}
      <footer className="flex h-14 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-8 text-sm">
        <div className="flex items-center gap-8">
          <Status label="MIDI" actif />
          <Status label="Audio" actif />
          <Status label="Réseau" actif />
          <Status label="Tablette" actif={false} />
        </div>

        <p className="text-zinc-500">Mode préparation</p>
      </footer>
    </main>
  );
}

function Status({
  label,
  actif,
}: {
  label: string;
  actif: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          actif ? "bg-emerald-400" : "bg-zinc-600"
        }`}
      />

      <span className={actif ? "text-zinc-300" : "text-zinc-600"}>
        {label}
      </span>
    </div>
  );
}