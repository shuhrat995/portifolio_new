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
  const message = error instanceof Error ? error.message : "Unexpected error";
  console.error("[admin api]", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

/** Makes the public pages pick up freshly written data. */
export function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/qw/dashboard");
}
