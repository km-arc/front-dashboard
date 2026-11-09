import createClient from "openapi-fetch";
import type { components, paths } from "./schema";

export type { components, operations, paths } from "./schema";
export type Brand = components["schemas"]["Brand"];
export type Problem = components["schemas"]["Problem"];

/** What openapi-fetch calls: it always passes a ready-made Request. */
export type ApiFetch = (input: Request) => Promise<Response>;

export interface ApiClientOptions {
  baseUrl: string;
  /** Defaults to the global fetch; the sample API passes its own (see `@front-dashboard/api/mock`). */
  fetch?: ApiFetch;
  headers?: HeadersInit;
}

export function createApiClient({ baseUrl, fetch, headers }: ApiClientOptions) {
  return createClient<paths>({ baseUrl, fetch, headers });
}

export type ApiClient = ReturnType<typeof createApiClient>;

function isProblem(value: unknown): value is Problem {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.title === "string" && typeof candidate.status === "number";
}

/** A failed API call: the HTTP status and, when the server sent one, its problem details. */
export class ApiError extends Error {
  readonly status: number;
  readonly problem: Problem | undefined;

  constructor(status: number, problem?: Problem) {
    super(problem?.title ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

type FetchResult<T, E> =
  { data: T; error?: never; response: Response } | { data?: never; error: E; response: Response };

/**
 * Returns the data of a call or throws an ApiError, so callers do not branch on `error`.
 * The result type is the success type without `undefined` (TypeScript infers it from both arms of the union).
 */
export function unwrap<T, E>(result: FetchResult<T, E>): Exclude<T, undefined> {
  if (result.error !== undefined || result.data === undefined) {
    throw new ApiError(result.response.status, isProblem(result.error) ? result.error : undefined);
  }
  return result.data as Exclude<T, undefined>;
}

/** For calls whose answer has no body (204): throws an ApiError unless the call succeeded. */
export function expectOk<E>(result: { error?: E; response: Response }): void {
  if (!result.response.ok) {
    throw new ApiError(result.response.status, isProblem(result.error) ? result.error : undefined);
  }
}
