import { createApiClient, type ApiFetch, type Brand } from "./client";

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

export const sampleRoutes: MockRoutes = {
  "GET /brand": () => json(SAMPLE_BRAND),
};

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
