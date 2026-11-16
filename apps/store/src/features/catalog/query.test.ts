import { describe, expect, it } from "vitest";
import { parseListQuery, toSearchParams } from "./query";

describe("parseListQuery", () => {
  it("uses the defaults when nothing is given", () => {
    expect(parseListQuery({})).toEqual({ sort: "newest", page: 1 });
  });

  it("reads a valid sort and page", () => {
    const query = parseListQuery({ sort: "price_asc", page: "3" });
    expect(query).toEqual({ sort: "price_asc", page: 3 });
  });

  it("takes the first value when a parameter is repeated", () => {
    expect(parseListQuery({ sort: ["price_desc", "newest"], page: ["2", "5"] })).toEqual({
      sort: "price_desc",
      page: 2,
    });
  });

  it("falls back for anything invalid", () => {
    expect(parseListQuery({ sort: "random", page: "0" })).toEqual({ sort: "newest", page: 1 });
    expect(parseListQuery({ page: "-2" }).page).toBe(1);
    expect(parseListQuery({ page: "1.5" }).page).toBe(1);
    expect(parseListQuery({ page: "abc" }).page).toBe(1);
  });
});

describe("toSearchParams", () => {
  it("leaves out the defaults", () => {
    expect(toSearchParams({ sort: "newest", page: 1 })).toEqual({});
  });

  it("keeps what differs from the defaults", () => {
    expect(toSearchParams({ sort: "price_desc", page: 4 })).toEqual({
      sort: "price_desc",
      page: "4",
    });
  });
});
