"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "../../i18n/navigation";
import { normalizeIranMobile, normalizeOtpCode } from "../../lib/identity";
import {
  AuthError,
  type ActionResult,
  type CodeRequest,
  type Session,
  type SessionService,
} from "./service";
import { getSessionService } from "./server";

async function run<T>(work: (service: SessionService) => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await work(await getSessionService()) };
  } catch (error) {
    if (error instanceof AuthError) return { ok: false, error: error.code };
    console.error("Unexpected sign-in failure:", error);
    return { ok: false, error: "unavailable" };
  }
}

/** Asks for a one-time code. The mobile number is checked again here, never trusted from the browser. */
export async function requestCodeAction(rawMobile: string): Promise<ActionResult<CodeRequest>> {
  const mobile = normalizeIranMobile(rawMobile);
  if (!mobile) return { ok: false, error: "invalid_mobile" };
  return run((service) => service.requestCode(mobile));
}

export async function signInWithCodeAction(
  rawMobile: string,
  rawCode: string,
): Promise<ActionResult<Session>> {
  const mobile = normalizeIranMobile(rawMobile);
  if (!mobile) return { ok: false, error: "invalid_mobile" };
  const code = normalizeOtpCode(rawCode);
  if (!code) return { ok: false, error: "invalid_code" };
  return run((service) => service.signInWithCode(mobile, code));
}

export async function signInWithPasswordAction(
  rawMobile: string,
  password: string,
): Promise<ActionResult<Session>> {
  const mobile = normalizeIranMobile(rawMobile);
  if (!mobile) return { ok: false, error: "invalid_mobile" };
  if (!password) return { ok: false, error: "invalid_credentials" };
  return run((service) => service.signInWithPassword(mobile, password));
}

/** Signs out and goes to the home page of the current language. */
export async function signOutAction(): Promise<void> {
  try {
    await (await getSessionService()).signOut();
  } catch (error) {
    console.error("Sign-out could not reach the API:", error);
  }
  redirect({ href: "/", locale: await getLocale() });
}
