import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "@front-dashboard/api";
import {
  createSampleApiClient,
  createSampleRoutes,
  MOCK_BASE_URL,
  problem,
  SAMPLE_OTP_CODE,
  SAMPLE_PASSWORD,
  SAMPLE_PASSWORD_MOBILE,
} from "@front-dashboard/api/mock";
import { AuthError, createSessionService, type TokenStore } from "./service";

const MOBILE = "09123456789";
const NOW = Date.parse("2026-11-08T10:00:00.000Z");

function memoryTokens(initial?: string) {
  let token = initial;
  let expires: Date | undefined;
  const store: TokenStore = {
    get: async () => token,
    set: async (value, date) => {
      token = value;
      expires = date;
    },
    clear: async () => {
      token = undefined;
      expires = undefined;
    },
  };
  return { store, current: () => ({ token, expires }) };
}

function serviceWith(initialToken?: string, routes = createSampleRoutes({ now: () => NOW })) {
  const tokens = memoryTokens(initialToken);
  const service = createSessionService({
    client: createSampleApiClient(routes),
    tokens: tokens.store,
  });
  return { service, tokens };
}

async function failure(work: Promise<unknown>): Promise<unknown> {
  try {
    await work;
  } catch (error) {
    return error;
  }
  return undefined;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sign in with a code", () => {
  it("asks for a code and reports when another may be requested", async () => {
    const { service } = serviceWith();
    expect(await service.requestCode(MOBILE)).toEqual({ retryAfterSeconds: 60, codeLength: 6 });
  });

  it("stores the token until the server's expiry and returns the session", async () => {
    const { service, tokens } = serviceWith();
    const session = await service.signInWithCode(MOBILE, SAMPLE_OTP_CODE);
    expect(session.user.mobile).toBe(MOBILE);
    expect(tokens.current().token).toBe(`sample.${MOBILE}`);
    expect(tokens.current().expires?.toISOString()).toBe(session.expiresAt);
  });

  it("explains a wrong code and stores nothing", async () => {
    const { service, tokens } = serviceWith();
    expect(await failure(service.signInWithCode(MOBILE, "000000"))).toMatchObject({
      code: "invalid_code",
    });
    expect(tokens.current().token).toBeUndefined();
  });

  it("explains a malformed mobile number", async () => {
    const { service } = serviceWith();
    expect(await failure(service.requestCode("123"))).toMatchObject({ code: "invalid_mobile" });
  });
});

describe("sign in with a password", () => {
  it("signs in the account that has a password", async () => {
    const { service, tokens } = serviceWith();
    const session = await service.signInWithPassword(SAMPLE_PASSWORD_MOBILE, SAMPLE_PASSWORD);
    expect(session.user.displayName).toBe("Sample user");
    expect(tokens.current().token).toBe(`sample.${SAMPLE_PASSWORD_MOBILE}`);
  });

  it("explains wrong credentials and stores nothing", async () => {
    const { service, tokens } = serviceWith();
    expect(await failure(service.signInWithPassword(MOBILE, SAMPLE_PASSWORD))).toMatchObject({
      code: "invalid_credentials",
    });
    expect(tokens.current().token).toBeUndefined();
  });
});

describe("getSession", () => {
  it("is null without a token", async () => {
    expect(await serviceWith().service.getSession()).toBeNull();
  });

  it("returns the user of a valid token", async () => {
    const { service } = serviceWith(`sample.${MOBILE}`);
    expect((await service.getSession())?.user.mobile).toBe(MOBILE);
  });

  it("is null for a token the server does not accept", async () => {
    expect(await serviceWith("garbage").service.getSession()).toBeNull();
  });

  it("says unavailable when the API fails, instead of pretending nobody is signed in", async () => {
    const { service } = serviceWith(`sample.${MOBILE}`, {
      "GET /auth/session": () => problem(503, "Down"),
    });
    const error = await failure(service.getSession());
    expect(error).toBeInstanceOf(AuthError);
    expect(error).toMatchObject({ code: "unavailable" });
  });

  it("says unavailable when the network fails", async () => {
    const tokens = memoryTokens(`sample.${MOBILE}`);
    const service = createSessionService({
      client: createApiClient({
        baseUrl: MOCK_BASE_URL,
        fetch: () => Promise.reject(new TypeError("offline")),
      }),
      tokens: tokens.store,
    });
    expect(await failure(service.getSession())).toMatchObject({ code: "unavailable" });
  });
});

describe("signOut", () => {
  it("forgets the token", async () => {
    const { service, tokens } = serviceWith(`sample.${MOBILE}`);
    await service.signOut();
    expect(tokens.current().token).toBeUndefined();
  });

  it("forgets the token even when the API cannot be reached", async () => {
    const { service, tokens } = serviceWith(`sample.${MOBILE}`, {
      "POST /auth/logout": () => problem(503, "Down"),
    });
    await service.signOut();
    expect(tokens.current().token).toBeUndefined();
  });
});
