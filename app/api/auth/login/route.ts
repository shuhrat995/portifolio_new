import { NextResponse } from "next/server";
import {
  checkThrottle,
  recordFailure,
  recordSuccess,
  startSession,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const key = clientKey(request);

  const throttle = checkThrottle(key);
  if (throttle.blocked) {
    const minutes = Math.max(1, Math.ceil(throttle.retryAfterSeconds / 60));
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in about ${minutes} minute(s).` },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Enter your password." }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    recordFailure(key);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  recordSuccess(key);
  await startSession();

  return NextResponse.json({ ok: true });
}
