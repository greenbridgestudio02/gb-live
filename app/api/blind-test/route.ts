export const dynamic = "force-dynamic";

type BuzzEntry = {
  playerId: string;
  playerName: string;
  buzzedAt: number;
};

type PlayerScore = {
  playerId: string;
  playerName: string;
  points: number;
};

type BlindTestState = {
  roundId: number;
  isActive: boolean;
  isOpen: boolean;
  winner: BuzzEntry | null;
  buzzes: BuzzEntry[];
  scores: PlayerScore[];
  updatedAt: number;
};

type G3BlindTestStore = typeof globalThis & {
  __g3BlindTestState?: BlindTestState;
};

const store = globalThis as G3BlindTestStore;

if (!store.__g3BlindTestState) {
  store.__g3BlindTestState = {
    roundId: 0,
    isActive: false,
    isOpen: false,
    winner: null,
    buzzes: [],
    scores: [],
    updatedAt: Date.now(),
  };
}

function getState() {
  return store.__g3BlindTestState!;
}

function ensurePlayerScore(
  scores: PlayerScore[],
  playerId: string,
  playerName: string
) {
  const existingPlayer = scores.find(
    (player) => player.playerId === playerId
  );

  if (existingPlayer) {
    return scores.map((player) =>
      player.playerId === playerId
        ? { ...player, playerName }
        : player
    );
  }

  return [
    ...scores,
    {
      playerId,
      playerName,
      points: 0,
    },
  ];
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

  if (action === "activate") {
    store.__g3BlindTestState = {
      ...current,
      isActive: true,
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "deactivate") {
    store.__g3BlindTestState = {
      ...current,
      isActive: false,
      isOpen: false,
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "open") {
    store.__g3BlindTestState = {
      roundId: current.roundId + 1,
      isActive: true,
      isOpen: true,
      winner: null,
      buzzes: [],
      scores: current.scores,
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
      isActive: true,
      isOpen: false,
      winner: null,
      buzzes: [],
      scores: current.scores,
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "reset-scores") {
    store.__g3BlindTestState = {
      ...current,
      scores: current.scores.map((player) => ({
        ...player,
        points: 0,
      })),
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "correct") {
    if (!current.winner) {
      return Response.json({
        ok: false,
        error: "Aucun joueur à valider",
        state: current,
      });
    }

    let scores = ensurePlayerScore(
      current.scores,
      current.winner.playerId,
      current.winner.playerName
    );

    scores = scores.map((player) =>
      player.playerId === current.winner!.playerId
        ? {
            ...player,
            points: player.points + 1,
          }
        : player
    );

    store.__g3BlindTestState = {
      ...current,
      scores,
      isOpen: false,
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "wrong") {
    if (!current.winner) {
      return Response.json({
        ok: false,
        error: "Aucun joueur à refuser",
        state: current,
      });
    }

    const remainingBuzzes = current.buzzes.filter(
      (buzz) =>
        buzz.playerId !== current.winner!.playerId
    );

    const nextWinner = remainingBuzzes[0] ?? null;

    store.__g3BlindTestState = {
      ...current,
      winner: nextWinner,
      buzzes: remainingBuzzes,
      isOpen: true,
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
    ].sort((a, b) => a.buzzedAt - b.buzzedAt);

    const winner =
      current.winner ??
      newBuzzes[0] ??
      null;

    const scores = ensurePlayerScore(
      current.scores,
      playerId,
      playerName
    );

    store.__g3BlindTestState = {
      ...current,
      winner,
      buzzes: newBuzzes,
      scores,
      isOpen: true,
      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  if (action === "new-game") {
    store.__g3BlindTestState = {
      roundId: 0,
      isActive: true,
      isOpen: false,
      winner: null,
      buzzes: [],
      scores: [],
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