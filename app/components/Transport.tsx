export default function Transport() {
  return (
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
  );
}