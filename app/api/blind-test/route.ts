export const dynamic = "force-dynamic";

type BuzzEntry = {
  playerId: string;
  playerName: string;
  buzzedAt: number;
};

type BlindTestState = {
  roundId: number;
  isOpen: boolean;
  winner: BuzzEntry | null;
  buzzes: BuzzEntry[];
  updatedAt: number;
};

type G3BlindTestStore = typeof globalThis & {
  __g3BlindTestState?: BlindTestState;
};

const store = globalThis as G3BlindTestStore;

if (!store.__g3BlindTestState) {
  store.__g3BlindTestState = {
    roundId: 1,
    isOpen: false,
    winner: null,
    buzzes: [],
    updatedAt: Date.now(),
  };
}

function getState() {
  return store.__g3BlindTestState!;
}

export async function GET() {
  return Response.json(getState(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const action = body?.action;

  const current = getState();

  if (action === "open") {
    store.__g3BlindTestState = {
      roundId: current.roundId + 1,
      isOpen: true,
      winner: null,
      buzzes: [],
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "close") {
    store.__g3BlindTestState = {
      ...current,
      isOpen: false,
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "reset") {
    store.__g3BlindTestState = {
      roundId: current.roundId + 1,
      isOpen: false,
      winner: null,
      buzzes: [],
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "buzz") {
    const playerId =
      typeof body.playerId === "string"
        ? body.playerId.trim()
        : "";

    const playerName =
      typeof body.playerName === "string"
        ? body.playerName.trim()
        : "";

    if (!playerId || !playerName) {
      return Response.json(
        {
          ok: false,
          error: "Joueur invalide",
        },
        {
          status: 400,
        }
      );
    }

    if (!current.isOpen) {
      return Response.json({
        ok: false,
        error: "Buzzer fermé",
        state: current,
      });
    }

    if (
      current.buzzes.some(
        (entry) => entry.playerId === playerId
      )
    ) {
      return Response.json({
        ok: false,
        error: "Joueur déjà enregistré",
        state: current,
      });
    }

    const buzz: BuzzEntry = {
      playerId,
      playerName,
      buzzedAt: Date.now(),
    };

    const newBuzzes = [
      ...current.buzzes,
      buzz,
    ].sort(
      (a, b) =>
        a.buzzedAt - b.buzzedAt
    );

    const winner =
      current.winner ?? newBuzzes[0] ?? null;

    store.__g3BlindTestState = {
      ...current,
      winner,
      buzzes: newBuzzes,
      isOpen: true,
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  return Response.json(
    {
      ok: false,
      error: "Action inconnue",
    },
    {
      status: 400,
    }
  );
}