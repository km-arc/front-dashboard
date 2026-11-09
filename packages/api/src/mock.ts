import { createApiClient, type ApiFetch, type Brand, type components } from "./client";

type Schemas = components["schemas"];
type AuthResult = Schemas["AuthResult"];

/**
 * Sample API: answers the contract in memory, with no network and no extra dependency.
 * Use it while the backend does not exist yet (or in tests) by giving its fetch to `createApiClient`.
 * When the real backend is ready, stop passing it and set the real base URL.
 */
export const MOCK_BASE_URL = "http://mock.local";

/** A green brand, so it is obvious when the sample API is the one answering. */
export const SAMPLE_BRAND: Brand = {
  id: "sample",
  name: "Sample",
  radius: "0.75rem",
  light: { primary: "oklch(0.52 0.17 155)", "primary-foreground": "#ffffff" },
  dark: { primary: "oklch(0.74 0.15 155)", "primary-foreground": "oklch(0.18 0.03 255)" },
};

/** Every valid mobile number signs in with this one-time code. */
export const SAMPLE_OTP_CODE = "123456";
/** Only this account has a password. */
export const SAMPLE_PASSWORD_MOBILE = "09120000000";
export const SAMPLE_PASSWORD = "Sample#2026";

const MOBILE = /^09\d{9}$/;
const TOKEN_PREFIX = "sample.";
const OTP_RETRY_SECONDS = 60;
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export type MockHandler = (request: Request) => Response | Promise<Response>;
/** Keys look like "GET /brand". */
export type MockRoutes = Record<string, MockHandler>;

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** An error answer in the shape of the contract's Problem. */
export function problem(status: number, title: string, detail?: string): Response {
  return new Response(JSON.stringify({ title, status, ...(detail ? { detail } : {}) }), {
    status,
    headers: { "Content-Type": "application/problem+json" },
  });
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await request.json();
    return typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const str = (value: unknown): string => (typeof value === "string" ? value : "");

function userFor(mobile: string): Schemas["User"] {
  const named = mobile === SAMPLE_PASSWORD_MOBILE ? { displayName: "Sample user" } : {};
  return { id: `sample-${mobile}`, mobile, ...named };
}

function authResult(mobile: string, now: number): AuthResult {
  const expiresAt = new Date(now + SESSION_MS).toISOString();
  return { token: `${TOKEN_PREFIX}${mobile}`, expiresAt, user: userFor(mobile) };
}

/** The sample token is "sample.<mobile>"; anything else is not signed in. */
function mobileFromBearer(request: Request): string | null {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  const mobile = token.startsWith(TOKEN_PREFIX) ? token.slice(TOKEN_PREFIX.length) : "";
  return MOBILE.test(mobile) ? mobile : null;
}

export interface SampleRoutesOptions {
  /** Current time in milliseconds; tests pass a fixed one. */
  now?: () => number;
}

export function createSampleRoutes({ now = Date.now }: SampleRoutesOptions = {}): MockRoutes {
  return {
    "GET /brand": () => json(SAMPLE_BRAND),

    "POST /auth/otp/request": async (request) => {
      const body = await readBody(request);
      if (!MOBILE.test(str(body.identifier))) return problem(400, "Invalid mobile number");
      const answer: Schemas["OtpRequested"] = {
        retryAfterSeconds: OTP_RETRY_SECONDS,
        codeLength: SAMPLE_OTP_CODE.length,
      };
      return json(answer, 202);
    },

    "POST /auth/otp/verify": async (request) => {
      const body = await readBody(request);
      const mobile = str(body.identifier);
      if (!MOBILE.test(mobile)) return problem(400, "Invalid mobile number");
      if (str(body.code) !== SAMPLE_OTP_CODE) return problem(401, "Invalid or expired code");
      return json(authResult(mobile, now()));
    },

    "POST /auth/login": async (request) => {
      const body = await readBody(request);
      const mobile = str(body.identifier);
      const known = mobile === SAMPLE_PASSWORD_MOBILE && str(body.password) === SAMPLE_PASSWORD;
      if (!known) return problem(401, "Wrong mobile number or password");
      return json(authResult(mobile, now()));
    },

    "GET /auth/session": (request) => {
      const mobile = mobileFromBearer(request);
      if (!mobile) return problem(401, "Not signed in");
      const info: Schemas["SessionInfo"] = {
        user: userFor(mobile),
        expiresAt: new Date(now() + SESSION_MS).toISOString(),
      };
      return json(info);
    },

    "POST /auth/logout": (request) => {
      return mobileFromBearer(request)
        ? new Response(null, { status: 204 })
        : problem(401, "Not signed in");
    },
  };
}

export const sampleRoutes: MockRoutes = createSampleRoutes();

/** A fetch that serves `routes`; anything else is a 404 problem, like a real server would answer. */
export function createMockFetch(routes: MockRoutes = sampleRoutes): ApiFetch {
  return async (request) => {
    const handler = routes[`${request.method} ${new URL(request.url).pathname}`];
    return handler ? handler(request) : problem(404, "Not found");
  };
}

/** Client wired to the sample API. */
export function createSampleApiClient(routes: MockRoutes = sampleRoutes) {
  return createApiClient({ baseUrl: MOCK_BASE_URL, fetch: createMockFetch(routes) });
}
