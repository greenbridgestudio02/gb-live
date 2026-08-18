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

/*
 * Permet de conserver automatiquement
 * un joueur dans le classement.
 */
function ensurePlayerScore(
  scores: PlayerScore[],
  playerId: string,
  playerName: string
) {
  const existingPlayer = scores.find(
    (player) => player.playerId === playerId
  );

  if (existingPlayer) {
    /*
     * Le pseudo peut avoir été modifié
     * depuis sa première participation.
     */
    return scores.map((player) =>
      player.playerId === playerId
        ? {
            ...player,
            playerName,
          }
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

  /*
   * OUVRIR UNE NOUVELLE MANCHE
   *
   * Les scores sont conservés.
   */
  if (action === "open") {
    store.__g3BlindTestState = {
      roundId: current.roundId + 1,

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

  /*
   * FERMER LES BUZZERS
   */
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

  /*
   * NOUVELLE MANCHE,
   * MAIS BUZZERS ENCORE FERMÉS.
   *
   * Les scores sont conservés.
   */
  if (action === "reset") {
    store.__g3BlindTestState = {
      roundId: current.roundId + 1,

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

  /*
   * REMISE À ZÉRO DU CLASSEMENT.
   *
   * On conserve les joueurs,
   * mais tous repartent à 0.
   */
  if (action === "reset-scores") {
    store.__g3BlindTestState = {
      ...current,

      scores: current.scores.map(
        (player) => ({
          ...player,
          points: 0,
        })
      ),

      updatedAt: Date.now(),
    };

    return Response.json({
      ok: true,
      state: getState(),
    });
  }

  /*
   * BONNE RÉPONSE
   *
   * Le joueur actuellement premier
   * gagne 1 point.
   */
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
      player.playerId ===
      current.winner!.playerId
        ? {
            ...player,
            points: player.points + 1,
          }
        : player
    );

    /*
     * Le buzz reste visible côté Admin,
     * mais on ferme les buzzers.
     */
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

  /*
   * MAUVAISE RÉPONSE
   *
   * Le premier joueur est éliminé
   * de cette tentative.
   *
   * S'il existe déjà un deuxième buzz,
   * il devient automatiquement prioritaire.
   *
   * Sinon les buzzers restent ouverts.
   */
  if (action === "wrong") {
    if (!current.winner) {
      return Response.json({
        ok: false,
        error: "Aucun joueur à refuser",
        state: current,
      });
    }

    const remainingBuzzes =
      current.buzzes.filter(
        (buzz) =>
          buzz.playerId !==
          current.winner!.playerId
      );

    const nextWinner =
      remainingBuzzes[0] ?? null;

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

  /*
   * BUZZ D'UN JOUEUR
   */
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

    /*
     * Un joueur ne peut buzzer
     * qu'une seule fois dans une manche.
     */
    if (
      current.buzzes.some(
        (entry) =>
          entry.playerId === playerId
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

    /*
     * Le premier joueur reste gagnant
     * jusqu'à validation ou mauvaise réponse.
     */
    const winner =
      current.winner ??
      newBuzzes[0] ??
      null;

    /*
     * Dès qu'un joueur participe,
     * il entre aussi dans le classement,
     * même avec 0 point.
     */
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

      /*
       * Important :
       * on continue d'enregistrer
       * l'ordre des autres buzz.
       */
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