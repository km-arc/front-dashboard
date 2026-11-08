import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "@front-dashboard/api";
import {
  createSampleApiClient,
  json,
  MOCK_BASE_URL,
  problem,
  SAMPLE_BRAND,
} from "@front-dashboard/api/mock";
import { loadBrand } from "./brand";

const quiet = () => vi.spyOn(console, "warn").mockImplementation(() => {});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadBrand", () => {
  it("returns the sample brand, which the real validator accepts", async () => {
    const warn = quiet();
    expect(await loadBrand(createSampleApiClient())).toMatchObject({ id: SAMPLE_BRAND.id });
    expect(warn).not.toHaveBeenCalled();
  });

  it("uses the default theme (null) when no API is configured", async () => {
    expect(await loadBrand(null)).toBeNull();
  });

  it("falls back when the API answers an error", async () => {
    const warn = quiet();
    const client = createSampleApiClient({
      "GET /brand": () => problem(503, "Brand service down"),
    });
    expect(await loadBrand(client)).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
  });

  it("falls back when the network fails", async () => {
    const warn = quiet();
    const client = createApiClient({
      baseUrl: MOCK_BASE_URL,
      fetch: () => Promise.reject(new TypeError("offline")),
    });
    expect(await loadBrand(client)).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
  });

  it("ignores a brand with unsafe values", async () => {
    const warn = quiet();
    const client = createSampleApiClient({
      "GET /brand": () => json({ id: "evil", light: { primary: "url(https://evil.example/x)" } }),
    });
    expect(await loadBrand(client)).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Brand ignored"));
  });
});
