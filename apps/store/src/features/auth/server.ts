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

/**
 * The signed-in user of this request (asked from the API once per request).
 * A visitor without the session cookie is signed out without calling the API, so a store with no API configured
 * still works for signed-out visitors (and a build that cannot reach an API does not fail).
 */
export const getSession = cache(async (): Promise<Session | null> => {
  if (!(await cookieTokenStore().get())) return null;
  return (await getSessionService()).getSession();
});

/**
 * Guard for pages that need a sign-in: call it on the server at the top of the page.
 * `next` is the path (without the locale) to come back to after signing in.
 */
export async function requireSession(locale: Locale, next: string): Promise<Session> {
  const session = await getSession();
  if (session) return session;
  // `redirect` does not return; TypeScript only knows that for functions declared with an explicit `never` type,
  // and this one is created by next-intl, so the throw below states it (and is never reached).
  redirect({ href: { pathname: "/login", query: { next } }, locale });
  throw new Error("redirect() returned");
}
