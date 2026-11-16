import { cache } from "react";
import { unwrap, type ApiClient, type components } from "@front-dashboard/api";
import type { Locale } from "@front-dashboard/ui/locales";
import { getApiClient } from "../../lib/api";
import type { Sort } from "./query";

/** The catalog cannot be read: no API is configured, or it failed. Pages show a notice instead of an error page. */
export class CatalogUnavailableError extends Error {
  readonly reason: unknown;

  constructor(reason?: unknown) {
    super("The catalog is not available");
    this.name = "CatalogUnavailableError";
    this.reason = reason;
  }
}

async function read<T>(work: (client: ApiClient) => Promise<T>): Promise<T> {
  const client = await getApiClient();
  if (!client) throw new CatalogUnavailableError();
  try {
    return await work(client);
  } catch (error) {
    throw new CatalogUnavailableError(error);
  }
}

/** The currency code chosen by the backend (for example IRT for Toman). */
export const getStoreCurrency = cache(async (): Promise<string> => {
  return read(async (client) => unwrap(await client.GET("/store/settings")).currency.code);
});

export const getCategories = cache(
  async (locale: Locale): Promise<components["schemas"]["CategoryList"]> => {
    return read(async (client) =>
      unwrap(await client.GET("/categories", { params: { query: { locale } } })),
    );
  },
);

export interface ProductListParams {
  locale: Locale;
  category?: string;
  q?: string;
  sort: Sort;
  page: number;
  pageSize: number;
}

export async function getProducts(
  params: ProductListParams,
): Promise<components["schemas"]["ProductPage"]> {
  return read(async (client) =>
    unwrap(await client.GET("/products", { params: { query: params } })),
  );
}
