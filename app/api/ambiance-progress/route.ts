import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AmbianceProgress = {
  file: string;
  currentTime: number;
  duration: number;
  paused: boolean;
  updatedAt: number;
};

type AmbianceProgressStore = typeof globalThis & {
  __gbAmbianceProgress?: AmbianceProgress;
};

const store = globalThis as AmbianceProgressStore;

export async function GET() {
  return NextResponse.json(
    store.__gbAmbianceProgress ?? {
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
      { error: "Donnees AMBIANCE invalides" },
      { status: 400 }
    );
  }

  store.__gbAmbianceProgress = {
    file: body.file,
    currentTime: Math.max(0, body.currentTime),
    duration: Math.max(0, body.duration),
    paused: body.paused,
    updatedAt: Date.now(),
  };

  return NextResponse.json({ ok: true });
}

