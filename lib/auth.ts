import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "qw_admin";

/** How long a successful login stays valid. */
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const FALLBACK_PASSWORD = "shuhrat995";

/**
 * The admin password. Set `ADMIN_PASSWORD` in `.env.local` (and in your hosting
 * provider's environment variables) to change it — never commit a real one.
 */
export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || FALLBACK_PASSWORD;
}

/** True when the deployment is still using the built-in default password. */
export function usingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD?.trim();
}

function secret(): string {
  return process.env.ADMIN_SECRET?.trim() || adminPassword();
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so the timing does not leak length.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(input: string): boolean {
  return safeEqual(input, adminPassword());
}

/** Creates a signed `expiry.signature` token. */
export function createSessionToken(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  return `${expires}.${sign(String(expires))}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

/* ------------------------------------------------------------------ */
/* Cookie helpers                                                      */
/* ------------------------------------------------------------------ */

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/* ------------------------------------------------------------------ */
/* Login throttling                                                    */
/* ------------------------------------------------------------------ */

type Attempt = { count: number; firstAt: number; blockedUntil: number };

const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 6;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 10 * 60 * 1000;

export function checkThrottle(key: string): { blocked: boolean; retryAfterSeconds: number } {
  const entry = attempts.get(key);
  if (!entry) return { blocked: false, retryAfterSeconds: 0 };

  if (entry.blockedUntil > Date.now()) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - Date.now()) / 1000),
    };
  }

  if (Date.now() - entry.firstAt > WINDOW_MS) {
    attempts.delete(key);
  }
  return { blocked: false, retryAfterSeconds: 0 };
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now, blockedUntil: 0 });
    return;
  }

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_MS;
    entry.count = 0;
    entry.firstAt = now;
  }
}

export function recordSuccess(key: string): void {
  attempts.delete(key);
}
