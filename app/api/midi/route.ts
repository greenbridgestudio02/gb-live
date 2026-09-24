import { writeFile } from "node:fs/promises";

import {
  execFile,
} from "node:child_process";

import path from "node:path";

import {
  promisify,
} from "node:util";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const execFileAsync =
  promisify(execFile);

export async function GET() {
  try {
    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "midi-list.cjs"
    );

    const { stdout } =
      await execFileAsync(
        process.execPath,
        [scriptPath],
        {
          cwd: process.cwd(),
          timeout: 5000,
        }
      );

    const result =
      JSON.parse(stdout);

    return Response.json(result);
  } catch (error) {
    console.error(
      "Impossible de lire les sorties MIDI.",
      error
    );

    return Response.json(
      {
        ok: false,
        outputs: [],
        error:
          error instanceof Error
            ? error.message
            : "Erreur MIDI inconnue",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const outputName =
      typeof body.outputName === "string"
        ? body.outputName
        : "";

    const channel =
      Number(body.channel);

    const msb =
      Number(body.msb);

    const lsb =
      Number(body.lsb);

    const program =
      Number(body.program);

    if (!outputName) {
      return Response.json(
        {
          ok: false,
          error:
            "Aucune sortie MIDI sélectionnée.",
        },
        {
          status: 400,
        }
      );
    }

    const commandFile = path.join(
  process.cwd(),
  "data",
  "midi-command.json"
);

const command = {
  type: "program-change",
  outputName,
  channel,
  msb,
  lsb,
  program,
  timestamp: Date.now(),
};

await writeFile(
  commandFile,
  JSON.stringify(command, null, 2),
  "utf8"
);

return Response.json({
  ok: true,
  output: outputName,
  channel,
  msb,
  lsb,
  program,
});

  } catch (error) {
    console.error(
      "Impossible d'envoyer la commande MIDI.",
      error
    );

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur MIDI inconnue",
      },
      {
        status: 500,
      }
    );
  }
}