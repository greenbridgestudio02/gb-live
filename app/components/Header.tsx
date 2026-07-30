export default function Header() {
  return (
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
  );
}