import { describe, expect, it } from "vitest";
import type { Category } from "./categories";
import { toMenuCategories } from "./menu";

const category = (slug: string, name: string, parentSlug?: string): Category => ({
  slug,
  name,
  productCount: 3,
  ...(parentSlug ? { parentSlug } : {}),
});

describe("toMenuCategories", () => {
  it("keeps the top-level categories with their direct children as plain data", () => {
    const menu = toMenuCategories([
      category("food", "Food"),
      category("tea", "Tea", "food"),
      category("honey", "Honey", "food"),
      category("books", "Books"),
    ]);
    expect(menu).toEqual([
      {
        slug: "food",
        name: "Food",
        productCount: 3,
        children: [
          { slug: "tea", name: "Tea" },
          { slug: "honey", name: "Honey" },
        ],
      },
      { slug: "books", name: "Books", productCount: 3, children: [] },
    ]);
  });

  it("is empty for an empty list", () => {
    expect(toMenuCategories([])).toEqual([]);
  });
});
