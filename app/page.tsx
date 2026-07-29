export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <section className="w-full max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
          GreenBridge Studio
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          GreenBridge Live
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Une interface pensée pour piloter un spectacle en direct,
          simplement, rapidement et sans détourner l’attention de la scène.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400">
            Créer un spectacle
          </button>

          <button className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold transition hover:bg-zinc-900">
            Ouvrir un spectacle
          </button>
        </div>
      </section>
    </main>
  );
}