import type { SessionUser } from "./service";

/** The user from the answer of `GET /api/auth/session`, or null for signed out, an error or anything unexpected. */
export async function readSessionResponse(response: Response): Promise<SessionUser | null> {
  if (!response.ok) return null;
  try {
    const body: unknown = await response.json();
    if (typeof body !== "object" || body === null || !("user" in body)) return null;
    const user = body.user;
    if (typeof user !== "object" || user === null) return null;
    const { id, mobile, displayName } = user as Record<string, unknown>;
    if (typeof id !== "string" || typeof mobile !== "string") return null;
    return typeof displayName === "string" ? { id, mobile, displayName } : { id, mobile };
  } catch {
    return null;
  }
}
