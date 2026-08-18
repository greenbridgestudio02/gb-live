import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";

import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AboutMe = {
  name: string;
  headline: string;
  bio: string;
  instruments: string;
  website: string;
  instagram: string;
  facebook: string;
  updatedAt: number;
};

const dataDirectory = path.join(
  process.cwd(),
  "data"
);

const aboutFile = path.join(
  dataDirectory,
  "about.json"
);

const emptyAbout: AboutMe = {
  name: "",
  headline: "",
  bio: "",
  instruments: "",
  website: "",
  instagram: "",
  facebook: "",
  updatedAt: 0,
};

async function readAbout(): Promise<AboutMe> {
  try {
    const content = await readFile(
      aboutFile,
      "utf-8"
    );

    const parsed = JSON.parse(
      content
    ) as Partial<AboutMe>;

    return {
      name:
        typeof parsed.name === "string"
          ? parsed.name
          : "",

      headline:
        typeof parsed.headline === "string"
          ? parsed.headline
          : "",

      bio:
        typeof parsed.bio === "string"
          ? parsed.bio
          : "",

      instruments:
        typeof parsed.instruments === "string"
          ? parsed.instruments
          : "",

      website:
        typeof parsed.website === "string"
          ? parsed.website
          : "",

      instagram:
        typeof parsed.instagram === "string"
          ? parsed.instagram
          : "",

      facebook:
        typeof parsed.facebook === "string"
          ? parsed.facebook
          : "",

      updatedAt:
        typeof parsed.updatedAt === "number"
          ? parsed.updatedAt
          : 0,
    };
  } catch {
    return emptyAbout;
  }
}

async function saveAbout(
  about: AboutMe
) {
  await mkdir(dataDirectory, {
    recursive: true,
  });

  await writeFile(
    aboutFile,
    JSON.stringify(
      about,
      null,
      2
    ),
    "utf-8"
  );
}

export async function GET() {
  const about = await readAbout();

  return Response.json(about, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(
  request: Request
) {
  const body = await request.json();

  const current =
    await readAbout();

  const about: AboutMe = {
    name:
      typeof body.name === "string"
        ? body.name
        : current.name,

    headline:
      typeof body.headline === "string"
        ? body.headline
        : current.headline,

    bio:
      typeof body.bio === "string"
        ? body.bio
        : current.bio,

    instruments:
      typeof body.instruments === "string"
        ? body.instruments
        : current.instruments,

    website:
      typeof body.website === "string"
        ? body.website
        : current.website,

    instagram:
      typeof body.instagram === "string"
        ? body.instagram
        : current.instagram,

    facebook:
      typeof body.facebook === "string"
        ? body.facebook
        : current.facebook,

    updatedAt: Date.now(),
  };

  await saveAbout(about);

  return Response.json({
    ok: true,
    about,
  });
}