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

export default function StatusBar() {
  return (
    <footer className="flex h-14 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-8 text-sm">
      <div className="flex items-center gap-8">
        <Status label="MIDI" actif />
        <Status label="Audio" actif />
        <Status label="Réseau" actif />
        <Status label="Tablette" actif={false} />
      </div>

      <p className="text-zinc-500">Mode préparation</p>
    </footer>
  );
}