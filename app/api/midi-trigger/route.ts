import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const triggerFile = path.join(
  process.cwd(),
  "data",
  "midi-trigger.json"
);

export async function GET() {
  try {
    const content = await readFile(
      triggerFile,
      "utf8"
    );

    const event = JSON.parse(content);

    return Response.json(event, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json(
      {
        type: null,
        timestamp: 0,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}