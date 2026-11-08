import { createApiClient, type ApiClient } from "@front-dashboard/api";
import { env } from "../env";

/** How long the server may reuse an API answer before asking again. */
export const API_REVALIDATE_SECONDS = 300;

/**
 * The API client for server code: the sample API when NEXT_PUBLIC_API_MOCKING=enabled,
 * the backend at API_BASE_URL otherwise, and null when neither is configured.
 */
export async function getApiClient(): Promise<ApiClient | null> {
  if (env.apiMocking) {
    const { createSampleApiClient } = await import("@front-dashboard/api/mock");
    return createSampleApiClient();
  }
  if (!env.apiBaseUrl) return null;
  return createApiClient({
    baseUrl: env.apiBaseUrl,
    fetch: (request) => fetch(request, { next: { revalidate: API_REVALIDATE_SECONDS } }),
  });
}
