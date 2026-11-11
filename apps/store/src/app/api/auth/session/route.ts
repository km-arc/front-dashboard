import { getSession } from "../../../../features/auth/server";

/** Who is signed in, for the header and the account menu. Never cached: it depends on the visitor's cookie. */
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const session = await getSession();
    return Response.json({ user: session?.user ?? null }, { headers });
  } catch {
    // The API cannot be asked: the header shows the signed-out state instead of failing the page.
    return Response.json({ user: null }, { status: 503, headers });
  }
}
