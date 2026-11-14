export const SORTS = ["newest", "price_asc", "price_desc"] as const;
export type Sort = (typeof SORTS)[number];

export const DEFAULT_SORT: Sort = "newest";
export const PAGE_SIZE = 12;

export interface ListQuery {
  sort: Sort;
  page: number;
}

type Raw = string | string[] | undefined;
const first = (value: Raw): string | undefined => (Array.isArray(value) ? value[0] : value);

/** Sort and page from a URL query string; anything invalid falls back to the defaults instead of failing. */
export function parseListQuery(params: { sort?: Raw; page?: Raw }): ListQuery {
  const sort = SORTS.find((value) => value === first(params.sort)) ?? DEFAULT_SORT;
  const page = Number(first(params.page));
  return { sort, page: Number.isInteger(page) && page >= 1 ? page : 1 };
}

/** The query string for a list, leaving out the defaults so URLs stay clean. */
export function toSearchParams(query: ListQuery): Record<string, string> {
  return {
    ...(query.sort !== DEFAULT_SORT ? { sort: query.sort } : {}),
    ...(query.page > 1 ? { page: String(query.page) } : {}),
  };
}
