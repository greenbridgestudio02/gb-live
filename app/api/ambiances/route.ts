import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const folder = path.join(process.cwd(), "public", "ambiances");
    const files = await readdir(folder);

    const videos = files
      .filter((file) => /\.(mp4|webm|mov)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, "fr"))
      .map((file) => ({
        name: path.parse(file).name.replace(/[-_]/g, " "),
        file: `/ambiances/${encodeURIComponent(file)}`
      }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Erreur bibliotheque AMBIANCE :", error);
    return NextResponse.json({ videos: [] });
  }
}
