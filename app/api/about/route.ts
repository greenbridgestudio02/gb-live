export const dynamic = "force-dynamic";

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

type G3AboutStore = typeof globalThis & {
  __g3AboutMe?: AboutMe;
};

const store = globalThis as G3AboutStore;

if (!store.__g3AboutMe) {
  store.__g3AboutMe = {
    name: "",
    headline: "",
    bio: "",
    instruments: "",
    website: "",
    instagram: "",
    facebook: "",
    updatedAt: Date.now(),
  };
}

export async function GET() {
  return Response.json(store.__g3AboutMe, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const current = store.__g3AboutMe!;

  store.__g3AboutMe = {
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

  return Response.json({
    ok: true,
    about: store.__g3AboutMe,
  });
}