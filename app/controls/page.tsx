"use client";

import { useEffect, useState } from "react";

type KeyInfo = {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  repeat: boolean;
  type: string;
};

export default function ControlsPage() {
  const [info, setInfo] = useState<KeyInfo | null>(null);
  const [pressCount, setPressCount] = useState(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      event.preventDefault();

      setInfo({
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        which: event.which,
        repeat: event.repeat,
        type: event.type,
      });

      setPressCount((count) => count + 1);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-700 bg-zinc-900 p-8">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          G3 Live
        </p>

        <h1 className="mt-3 text-center text-4xl font-bold">
          Test BlueTurn
        </h1>

        <p className="mt-3 text-center text-zinc-500">
          Appuie sur une pédale.
        </p>

        <div className="mt-8 space-y-3 rounded-2xl border border-zinc-700 bg-zinc-950 p-6 text-lg">
          <p>
            key : <strong>{info?.key || "—"}</strong>
          </p>

          <p>
            code : <strong>{info?.code || "—"}</strong>
          </p>

          <p>
            keyCode : <strong>{info?.keyCode ?? "—"}</strong>
          </p>

          <p>
            which : <strong>{info?.which ?? "—"}</strong>
          </p>

          <p>
            repeat : <strong>{String(info?.repeat ?? false)}</strong>
          </p>

          <p>
            type : <strong>{info?.type || "—"}</strong>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Pressions détectées : {pressCount}
        </p>
      </div>
    </main>
  );
}