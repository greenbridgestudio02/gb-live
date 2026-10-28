import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DjProgress = {
  file: string;
  currentTime: number;
  duration: number;
  paused: boolean;
  updatedAt: number;
};

type DjProgressStore = typeof globalThis & {
  __gbDjProgress?: DjProgress;
};

const store = globalThis as DjProgressStore;

export async function GET() {
  return NextResponse.json(
    store.__gbDjProgress ?? {
      file: "",
      currentTime: 0,
      duration: 0,
      paused: true,
      updatedAt: 0,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (
    typeof body.file !== "string" ||
    typeof body.currentTime !== "number" ||
    !Number.isFinite(body.currentTime) ||
    typeof body.duration !== "number" ||
    !Number.isFinite(body.duration) ||
    typeof body.paused !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Donnees DJ invalides" },
      { status: 400 }
    );
  }

  store.__gbDjProgress = {
    file: body.file,
    currentTime: Math.max(0, body.currentTime),
    duration: Math.max(0, body.duration),
    paused: body.paused,
    updatedAt: Date.now(),
  };

  return NextResponse.json({ ok: true });
}
