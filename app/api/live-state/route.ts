export const dynamic = "force-dynamic";

type PublicLyricLine = {
  time: number;
  text: string;
};

type PublicSong = {
  id: string;
  title: string;
  kind?: "vocal" | "instrumental";
  lyrics: string;
  lyricLines: PublicLyricLine[];
  needsLyricsSync?: boolean;
};

type PublicMode = "home" | "song" | "message";

type LiveState = {
  mode: PublicMode;

  song: PublicSong | null;

  elapsedTime: number;
  isPlaying: boolean;

  message: string;

  updatedAt: number;
};

type G3GlobalStore = typeof globalThis & {
  __g3LiveState?: LiveState;

  __g3LiveClients?: Set<
    ReadableStreamDefaultController<Uint8Array>
  >;
};

const store = globalThis as G3GlobalStore;

if (!store.__g3LiveState) {
  store.__g3LiveState = {
    mode: "home",

    song: null,

    elapsedTime: 0,
    isPlaying: false,

    message: "",

    updatedAt: Date.now(),
  };
}

if (!store.__g3LiveClients) {
  store.__g3LiveClients = new Set();
}

const encoder = new TextEncoder();

function broadcast(state: LiveState) {
  const message = encoder.encode(
    `data: ${JSON.stringify(state)}\n\n`
  );

  for (const controller of store.__g3LiveClients!) {
    try {
      controller.enqueue(message);
    } catch {
      store.__g3LiveClients!.delete(controller);
    }
  }
}

function parseSong(value: unknown): PublicSong | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return undefined;
  }

  const rawSong = value as Record<string, unknown>;

  if (
    typeof rawSong.id !== "string" ||
    typeof rawSong.title !== "string"
  ) {
    return undefined;
  }

  const lyricLines: PublicLyricLine[] =
    Array.isArray(rawSong.lyricLines)
      ? rawSong.lyricLines
          .filter((line): line is Record<string, unknown> => {
            return (
              typeof line === "object" &&
              line !== null &&
              typeof (line as Record<string, unknown>).time ===
                "number" &&
              typeof (line as Record<string, unknown>).text ===
                "string"
            );
          })
          .map((line) => ({
            time: line.time as number,
            text: line.text as string,
          }))
      : [];

  return {
    id: rawSong.id,
    title: rawSong.title,

    kind:
      rawSong.kind === "instrumental"
        ? "instrumental"
        : "vocal",

    lyrics:
      typeof rawSong.lyrics === "string"
        ? rawSong.lyrics
        : "",

    lyricLines,

    needsLyricsSync:
      rawSong.needsLyricsSync === true,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  // On conserve le flux SSE pour pouvoir
  // l'utiliser à nouveau plus tard si nécessaire.
  if (url.searchParams.get("stream") === "1") {
    let currentController:
      | ReadableStreamDefaultController<Uint8Array>
      | null = null;

    let keepAlive:
      | ReturnType<typeof setInterval>
      | null = null;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        currentController = controller;

        store.__g3LiveClients!.add(controller);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify(
              store.__g3LiveState
            )}\n\n`
          )
        );

        keepAlive = setInterval(() => {
          try {
            controller.enqueue(
              encoder.encode(": keep-alive\n\n")
            );
          } catch {
            if (keepAlive) {
              clearInterval(keepAlive);
            }

            store.__g3LiveClients!.delete(
              controller
            );
          }
        }, 15000);
      },

      cancel() {
        if (keepAlive) {
          clearInterval(keepAlive);
        }

        if (currentController) {
          store.__g3LiveClients!.delete(
            currentController
          );
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  return Response.json(store.__g3LiveState, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const currentState = store.__g3LiveState!;

  let mode = currentState.mode;

  if (
    body.mode === "home" ||
    body.mode === "song" ||
    body.mode === "message"
  ) {
    mode = body.mode;
  }

  const parsedSong = parseSong(body.song);

  const song =
    parsedSong !== undefined
      ? parsedSong
      : currentState.song;

  const elapsedTime =
    typeof body.elapsedTime === "number"
      ? body.elapsedTime
      : currentState.elapsedTime;

  const isPlaying =
    typeof body.isPlaying === "boolean"
      ? body.isPlaying
      : currentState.isPlaying;

  const message =
    typeof body.message === "string"
      ? body.message
      : currentState.message;

  const newState: LiveState = {
    mode,

    song,

    elapsedTime,

    isPlaying,

    message,

    updatedAt: Date.now(),
  };

  store.__g3LiveState = newState;

  broadcast(newState);

  return Response.json({
    ok: true,
    state: newState,
  });
}