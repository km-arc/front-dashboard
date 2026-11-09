import { ApiError, expectOk, unwrap, type ApiClient, type components } from "@front-dashboard/api";

type Schemas = components["schemas"];

export type SessionUser = Schemas["User"];

export interface Session {
  user: SessionUser;
  /** ISO date-time at which the sign-in ends. */
  expiresAt: string;
}

export interface CodeRequest {
  retryAfterSeconds: number;
  codeLength: number;
}

export type AuthErrorCode =
  "invalid_mobile" | "invalid_code" | "invalid_credentials" | "unavailable";

/** A sign-in problem the interface can explain to the user. */
export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

/** Where the sign-in token lives. In the app it is an httpOnly cookie, so browser scripts can never read it. */
export interface TokenStore {
  get(): Promise<string | undefined>;
  set(token: string, expires: Date): Promise<void>;
  clear(): Promise<void>;
}

/** Everything the app needs from authentication; the real backend replaces only the implementation. */
export interface SessionService {
  requestCode(mobile: string): Promise<CodeRequest>;
  signInWithCode(mobile: string, code: string): Promise<Session>;
  signInWithPassword(mobile: string, password: string): Promise<Session>;
  /** The signed-in user, or null when there is no valid sign-in. Throws AuthError("unavailable") if the API fails. */
  getSession(): Promise<Session | null>;
  /** Ends the sign-in. The token is forgotten even when the API cannot be reached. */
  signOut(): Promise<void>;
}

/** `wrongSecret` is what a 401 means for this call: a wrong code or a wrong password. */
function toAuthError(error: unknown, wrongSecret: AuthErrorCode): AuthError {
  if (error instanceof AuthError) return error;
  if (error instanceof ApiError) {
    if (error.status === 400) return new AuthError("invalid_mobile");
    if (error.status === 401) return new AuthError(wrongSecret);
  }
  return new AuthError("unavailable");
}

const bearer = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export interface SessionServiceDeps {
  client: ApiClient;
  tokens: TokenStore;
}

export function createSessionService({ client, tokens }: SessionServiceDeps): SessionService {
  async function start(auth: Schemas["AuthResult"]): Promise<Session> {
    await tokens.set(auth.token, new Date(auth.expiresAt));
    return { user: auth.user, expiresAt: auth.expiresAt };
  }

  return {
    async requestCode(mobile) {
      try {
        const body = { kind: "mobile", identifier: mobile } as const;
        return unwrap(await client.POST("/auth/otp/request", { body }));
      } catch (error) {
        throw toAuthError(error, "invalid_code");
      }
    },

    async signInWithCode(mobile, code) {
      try {
        const body = { kind: "mobile", identifier: mobile, code } as const;
        return await start(unwrap(await client.POST("/auth/otp/verify", { body })));
      } catch (error) {
        throw toAuthError(error, "invalid_code");
      }
    },

    async signInWithPassword(mobile, password) {
      try {
        const body = { kind: "mobile", identifier: mobile, password } as const;
        return await start(unwrap(await client.POST("/auth/login", { body })));
      } catch (error) {
        throw toAuthError(error, "invalid_credentials");
      }
    },

    async getSession() {
      const token = await tokens.get();
      if (!token) return null;
      try {
        const info = unwrap(await client.GET("/auth/session", bearer(token)));
        return { user: info.user, expiresAt: info.expiresAt };
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw toAuthError(error, "unavailable");
      }
    },

    async signOut() {
      const token = await tokens.get();
      if (token) {
        try {
          expectOk(await client.POST("/auth/logout", bearer(token)));
        } catch {
          // The token is dropped below either way; a failed call only leaves it valid on the server until it expires.
        }
      }
      await tokens.clear();
    },
  };
}

export type ActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error: AuthErrorCode };
