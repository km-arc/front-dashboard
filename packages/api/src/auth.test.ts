import { describe, expect, it } from "vitest";
import { ApiError, expectOk, unwrap } from "./client";
import {
  createSampleApiClient,
  createSampleRoutes,
  SAMPLE_OTP_CODE,
  SAMPLE_PASSWORD,
  SAMPLE_PASSWORD_MOBILE,
} from "./mock";

const MOBILE = "09123456789";
const NOW = Date.parse("2026-11-08T10:00:00.000Z");

const client = () => createSampleApiClient(createSampleRoutes({ now: () => NOW }));
const bearer = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

describe("sign in with a one-time code", () => {
  it("sends a code and says when another may be requested", async () => {
    const result = await client().POST("/auth/otp/request", {
      body: { kind: "mobile", identifier: MOBILE },
    });
    expect(result.response.status).toBe(202);
    expect(result.data).toEqual({ retryAfterSeconds: 60, codeLength: SAMPLE_OTP_CODE.length });
  });

  it("rejects a malformed mobile number", async () => {
    const result = await client().POST("/auth/otp/request", {
      body: { kind: "mobile", identifier: "12345" },
    });
    expect(result.response.status).toBe(400);
    expect(result.error).toMatchObject({ title: "Invalid mobile number" });
  });

  it("signs in with the right code and returns a token, the user and an expiry", async () => {
    const result = await client().POST("/auth/otp/verify", {
      body: { kind: "mobile", identifier: MOBILE, code: SAMPLE_OTP_CODE },
    });
    const auth = unwrap(result);
    expect(auth.user.mobile).toBe(MOBILE);
    expect(auth.token).not.toBe("");
    expect(auth.expiresAt).toBe("2026-11-15T10:00:00.000Z");
  });

  it("refuses a wrong code", async () => {
    const result = await client().POST("/auth/otp/verify", {
      body: { kind: "mobile", identifier: MOBILE, code: "000000" },
    });
    expect(result.response.status).toBe(401);
  });
});

describe("sign in with a password", () => {
  it("works for the account that has one", async () => {
    const result = await client().POST("/auth/login", {
      body: { kind: "mobile", identifier: SAMPLE_PASSWORD_MOBILE, password: SAMPLE_PASSWORD },
    });
    expect(unwrap(result).user.displayName).toBe("Sample user");
  });

  it("gives the same answer for a wrong password and for an account without one", async () => {
    const wrong = await client().POST("/auth/login", {
      body: { kind: "mobile", identifier: SAMPLE_PASSWORD_MOBILE, password: "nope" },
    });
    const unknown = await client().POST("/auth/login", {
      body: { kind: "mobile", identifier: MOBILE, password: SAMPLE_PASSWORD },
    });
    expect(wrong.response.status).toBe(401);
    expect(unknown.response.status).toBe(401);
    expect(unknown.error).toEqual(wrong.error);
  });
});

describe("session and sign out", () => {
  it("returns the user of a valid token", async () => {
    const api = client();
    const auth = unwrap(
      await api.POST("/auth/otp/verify", {
        body: { kind: "mobile", identifier: MOBILE, code: SAMPLE_OTP_CODE },
      }),
    );
    const session = unwrap(await api.GET("/auth/session", bearer(auth.token)));
    expect(session.user.mobile).toBe(MOBILE);
  });

  it("answers 401 without a token or with a bad one", async () => {
    const api = client();
    expect((await api.GET("/auth/session")).response.status).toBe(401);
    expect((await api.GET("/auth/session", bearer("garbage"))).response.status).toBe(401);
  });

  it("signs out with a token and refuses without one", async () => {
    const api = client();
    expectOk(await api.POST("/auth/logout", bearer(`sample.${MOBILE}`)));
    const failed = { error: undefined, response: new Response(null, { status: 401 }) };
    expect(() => expectOk(failed)).toThrow(ApiError);
    expect((await api.POST("/auth/logout")).response.status).toBe(401);
  });
});
