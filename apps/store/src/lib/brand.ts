import { unwrap, type ApiClient } from "@front-dashboard/api";
import { validateBrand, type BrandDefinition } from "@front-dashboard/ui/theme-ssr";
import { getApiClient } from "./api";

/**
 * The store brand, or null (the default theme) when there is no API, it fails, or the brand is not valid.
 * It never throws: a brand problem must not take the store down.
 */
export async function loadBrand(client: ApiClient | null): Promise<BrandDefinition | null> {
  if (!client) return null;
  try {
    const validated = validateBrand(unwrap(await client.GET("/brand")));
    if (validated.ok) return validated.brand;
    console.warn(`Brand ignored: ${validated.issues.join("; ")}`);
  } catch (error) {
    console.warn("Brand unavailable, using the default theme:", error);
  }
  return null;
}

export async function getBrand(): Promise<BrandDefinition | null> {
  return loadBrand(await getApiClient());
}
