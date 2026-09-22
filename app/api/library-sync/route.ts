import {
  copyFile,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";

import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type LibrarySnapshot = {
  songs: unknown[];
  setlistSongIds: string[];
  requestedSongIds: string[];
  updatedAt: number;
};

const dataDirectory = path.join(
  process.cwd(),
  "data"
);

const libraryFile = path.join(
  dataDirectory,
  "library.json"
);

const backupFiles = Array.from(
  { length: 5 },
  (_, index) =>
    path.join(
      dataDirectory,
      `library-backup-${index + 1}.json`
    )
);

const emptySnapshot: LibrarySnapshot = {
  songs: [],
  setlistSongIds: [],
  requestedSongIds: [],
  updatedAt: 0,
};

async function readLibrary(): Promise<LibrarySnapshot> {
  try {
    const content = await readFile(
      libraryFile,
      "utf-8"
    );

    const parsed = JSON.parse(
      content
    ) as Partial<LibrarySnapshot>;

    return {
      songs: Array.isArray(parsed.songs)
        ? parsed.songs
        : [],

      setlistSongIds: Array.isArray(
        parsed.setlistSongIds
      )
        ? parsed.setlistSongIds.filter(
            (id): id is string =>
              typeof id === "string"
          )
        : [],

      requestedSongIds: Array.isArray(
        parsed.requestedSongIds
      )
        ? parsed.requestedSongIds.filter(
            (id): id is string =>
              typeof id === "string"
          )
        : [],

      updatedAt:
        typeof parsed.updatedAt === "number"
          ? parsed.updatedAt
          : 0,
    };
  } catch {
    return emptySnapshot;
  }
}

async function backupLibrary() {
  try {
    for (let index = backupFiles.length - 1; index > 0; index--) {
      try {
        await copyFile(
          backupFiles[index - 1],
          backupFiles[index]
        );
      } catch {
        // La sauvegarde précédente n'existe peut-être pas encore.
      }
    }

    await copyFile(
      libraryFile,
      backupFiles[0]
    );
  } catch {
    // library.json n'existe peut-être pas encore.
  }
}

async function saveLibrary(
  snapshot: LibrarySnapshot
) {
  await mkdir(dataDirectory, {
    recursive: true,
  });

  await backupLibrary();

  await writeFile(
    libraryFile,
    JSON.stringify(
      snapshot,
      null,
      2
    ),
    "utf-8"
  );
}

export async function GET() {
  const snapshot = await readLibrary();

  return Response.json(snapshot, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(
  request: Request
) {
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

  const snapshot: LibrarySnapshot = {
    songs,
    setlistSongIds,
    requestedSongIds,
    updatedAt: Date.now(),
  };

  await saveLibrary(snapshot);

  return Response.json({
    ok: true,
    snapshot,
  });
}