import { cookies } from "next/headers";
import type { TokenStore } from "./service";

/** Server only (it uses next/headers): never import this from a client component. */
export const SESSION_COOKIE = "fd_session";

export function cookieTokenStore(): TokenStore {
  return {
    async get() {
      return (await cookies()).get(SESSION_COOKIE)?.value;
    },
    async set(token, expires) {
      (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires,
      });
    },
    async clear() {
      (await cookies()).delete(SESSION_COOKIE);
    },
  };
}
