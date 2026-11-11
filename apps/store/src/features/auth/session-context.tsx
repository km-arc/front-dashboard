"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "../../i18n/navigation";
import { readSessionResponse } from "./session-client";
import type { SessionUser } from "./service";

export type SessionState =
  { status: "loading" } | { status: "signed-out" } | { status: "signed-in"; user: SessionUser };

const SessionContext = createContext<SessionState>({ status: "loading" });

/**
 * Who is signed in, for the parts of the page that look different (the header). It asks `/api/auth/session` after the
 * first render and again on every navigation, because signing in or out always navigates. Pages stay static.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<SessionState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then(readSessionResponse)
      .then((user) => setState(user ? { status: "signed-in", user } : { status: "signed-out" }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.warn("Could not ask who is signed in:", error);
          setState({ status: "signed-out" });
        }
      });
    return () => controller.abort();
  }, [pathname]);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}

export function useSessionState(): SessionState {
  return useContext(SessionContext);
}
