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

type LiveState = {
  song: PublicSong | null;
  elapsedTime: number;
  isPlaying: boolean;
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
    song: null,
    elapsedTime: 0,
    isPlaying: false,
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

export async function GET(request: Request) {
  const url = new URL(request.url);

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

            store.__g3LiveClients!.delete(controller);
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

  const song =
    body.song &&
    typeof body.song.id === "string" &&
    typeof body.song.title === "string"
      ? {
          id: body.song.id,
          title: body.song.title,

          kind:
            body.song.kind === "instrumental"
              ? "instrumental"
              : "vocal",

          lyrics:
            typeof body.song.lyrics === "string"
              ? body.song.lyrics
              : "",

          lyricLines: Array.isArray(
            body.song.lyricLines
          )
            ? body.song.lyricLines
                .filter(
                  (line: unknown) =>
                    typeof line === "object" &&
                    line !== null &&
                    "time" in line &&
                    "text" in line &&
                    typeof (
                      line as {
                        time: unknown;
                      }
                    ).time === "number" &&
                    typeof (
                      line as {
                        text: unknown;
                      }
                    ).text === "string"
                )
                .map(
                  (line: {
                    time: number;
                    text: string;
                  }) => ({
                    time: line.time,
                    text: line.text,
                  })
                )
            : [],

          needsLyricsSync:
            body.song.needsLyricsSync === true,
        }
      : null;

  const newState: LiveState = {
    song,

    elapsedTime:
      typeof body.elapsedTime === "number"
        ? body.elapsedTime
        : 0,

    isPlaying:
      typeof body.isPlaying === "boolean"
        ? body.isPlaying
        : false,

    updatedAt: Date.now(),
  };

  store.__g3LiveState = newState;

  broadcast(newState);

  return Response.json({
    ok: true,
    state: newState,
  });
}