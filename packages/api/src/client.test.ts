import { describe, expect, it } from "vitest";
import { ApiError, createApiClient, unwrap } from "./client";
import { createSampleApiClient, MOCK_BASE_URL, problem, SAMPLE_BRAND } from "./mock";

describe("sample API", () => {
  it("answers GET /brand with the sample brand", async () => {
    const result = await createSampleApiClient().GET("/brand");
    expect(result.response.status).toBe(200);
    expect(result.data).toEqual(SAMPLE_BRAND);
  });

  it("answers unknown paths with a 404 problem", async () => {
    const client = createSampleApiClient({});
    const result = await client.GET("/brand");
    expect(result.response.status).toBe(404);
    expect(result.error).toMatchObject({ status: 404, title: "Not found" });
  });
});

describe("unwrap", () => {
  it("returns the data of a successful call", async () => {
    expect(unwrap(await createSampleApiClient().GET("/brand"))).toEqual(SAMPLE_BRAND);
  });

  it("throws an ApiError carrying the problem details", async () => {
    const client = createSampleApiClient({
      "GET /brand": () => problem(503, "Brand service unavailable", "Try again later"),
    });
    const failure = await client.GET("/brand").then(unwrap, (error: unknown) => error);
    expect(failure).toBeInstanceOf(ApiError);
    expect(failure).toMatchObject({
      status: 503,
      message: "Brand service unavailable",
      problem: { detail: "Try again later" },
    });
  });

  it("throws an ApiError without problem details when the body is not a problem", async () => {
    const client = createSampleApiClient({
      "GET /brand": () => new Response("boom", { status: 500 }),
    });
    const failure = await client.GET("/brand").then(unwrap, (error: unknown) => error);
    expect(failure).toBeInstanceOf(ApiError);
    expect(failure).toMatchObject({ status: 500, problem: undefined });
  });
});

describe("createApiClient", () => {
  it("does not hide network failures", async () => {
    const client = createApiClient({
      baseUrl: MOCK_BASE_URL,
      fetch: () => Promise.reject(new TypeError("network down")),
    });
    await expect(client.GET("/brand")).rejects.toThrow("network down");
  });
});
