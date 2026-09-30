import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "./auth";

export class Unauthorized extends Error {}

/** Throws when the request does not carry a valid admin session. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Unauthorized("Not signed in");
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof Unauthorized) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  console.error("[admin api]", error);
  // Admin-only route, so exposing the real message is safe and makes
  // Vercel misconfiguration (missing GITHUB_TOKEN, bad token, etc.)
  // visible in the dashboard instead of a generic 500.
  const message =
    error instanceof Error && error.message
      ? error.message
      : "Something went wrong. Please try again later.";
  return NextResponse.json({ error: message }, { status: 500 });
}

/** Makes the public pages pick up freshly written data. */
export function refreshPublicPages() {
  try {
    revalidatePath("/");
    revalidatePath("/qw/dashboard");
  } catch (error) {
    // A revalidate failure must never turn a successful save into a 500.
    console.error("[admin api] revalidate failed", error);
  }
}
