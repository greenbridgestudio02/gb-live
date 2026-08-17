export const dynamic = "force-dynamic";

type LibrarySnapshot = {
  songs: unknown[];
  setlistSongIds: string[];
  requestedSongIds: string[];
  updatedAt: number;
};

type G3LibraryStore = typeof globalThis & {
  __g3LibrarySnapshot?: LibrarySnapshot;
};

const store = globalThis as G3LibraryStore;

if (!store.__g3LibrarySnapshot) {
  store.__g3LibrarySnapshot = {
    songs: [],
    setlistSongIds: [],
    requestedSongIds: [],
    updatedAt: Date.now(),
  };
}

export async function GET() {
  return Response.json(store.__g3LibrarySnapshot, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const songs = Array.isArray(body.songs)
    ? body.songs
    : [];

  const setlistSongIds = Array.isArray(
    body.setlistSongIds
  )
    ? body.setlistSongIds.filter(
        (id: unknown): id is string =>
          typeof id === "string"
      )
    : [];

  const requestedSongIds = Array.isArray(
    body.requestedSongIds
  )
    ? body.requestedSongIds.filter(
        (id: unknown): id is string =>
          typeof id === "string"
      )
    : [];

  store.__g3LibrarySnapshot = {
    songs,
    setlistSongIds,
    requestedSongIds,
    updatedAt: Date.now(),
  };

  return Response.json({
    ok: true,
    snapshot: store.__g3LibrarySnapshot,
  });
}