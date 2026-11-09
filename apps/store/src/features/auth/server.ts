import { cache } from "react";
import type { Locale } from "@front-dashboard/ui/locales";
import { redirect } from "../../i18n/navigation";
import { getApiClient } from "../../lib/api";
import { AuthError, createSessionService, type Session, type SessionService } from "./service";
import { cookieTokenStore } from "./token-store";

/** The session service for the current request: the API client plus the session cookie. */
export async function getSessionService(): Promise<SessionService> {
  const client = await getApiClient();
  if (!client) throw new AuthError("unavailable");
  return createSessionService({ client, tokens: cookieTokenStore() });
}

/** The signed-in user of this request (asked from the API once per request). */
export const getSession = cache(async (): Promise<Session | null> => {
  return (await getSessionService()).getSession();
});

/**
 * Guard for pages that need a sign-in: call it on the server at the top of the page.
 * `next` is the path (without the locale) to come back to after signing in.
 */
export async function requireSession(locale: Locale, next: string): Promise<Session> {
  const session = await getSession();
  if (!session) redirect({ href: { pathname: "/login", query: { next } }, locale });
  return session;
}
