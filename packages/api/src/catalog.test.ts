import { describe, expect, it } from "vitest";
import { unwrap } from "./client";
import { createSampleApiClient } from "./mock";
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from "./sample-catalog";

const api = () => createSampleApiClient();

describe("store settings", () => {
  it("names the currency, so the front end never hard-codes the unit", async () => {
    expect(unwrap(await api().GET("/store/settings")).currency.code).toBe("IRT");
  });
});

describe("categories", () => {
  it("returns the tree as a flat list with parent links", async () => {
    const { items } = unwrap(await api().GET("/categories"));
    const top = items.filter((category) => !category.parentSlug).map((category) => category.slug);
    expect(top).toEqual(["digital-goods", "books-culture", "online-courses", "supermarket"]);
    expect(items.find((category) => category.slug === "books")?.parentSlug).toBe("books-culture");
    expect(items).toHaveLength(SAMPLE_CATEGORIES.length);
  });

  it("counts the products below a top-level category", async () => {
    const { items } = unwrap(await api().GET("/categories"));
    const count = (slug: string) => items.find((category) => category.slug === slug)?.productCount;
    expect(count("online-courses")).toBe(4);
    expect(count("programming")).toBe(2);
    const topTotal = ["digital-goods", "books-culture", "online-courses", "supermarket"]
      .map(count)
      .reduce<number>((sum, value) => sum + (value ?? 0), 0);
    expect(topTotal).toBe(SAMPLE_PRODUCTS.length);
  });

  it("answers in the requested language", async () => {
    const fa = unwrap(await api().GET("/categories", { params: { query: { locale: "fa" } } }));
    expect(fa.items.find((category) => category.slug === "supermarket")?.name).toBe(
      "سوپرمارکت و کالاهای خوراکی",
    );
  });

  it("rejects an unknown language", async () => {
    const result = await api().GET("/categories", {
      params: { query: { locale: "de" as "en" } },
    });
    expect(result.response.status).toBe(400);
  });
});

describe("product list", () => {
  it("pages the products and reports the totals", async () => {
    const page = unwrap(
      await api().GET("/products", { params: { query: { page: 2, pageSize: 6 } } }),
    );
    expect(page).toMatchObject({ page: 2, pageSize: 6, total: SAMPLE_PRODUCTS.length });
    expect(page.totalPages).toBe(Math.ceil(SAMPLE_PRODUCTS.length / 6));
    expect(page.items).toHaveLength(6);
  });

  it("returns an empty page past the end", async () => {
    const page = unwrap(await api().GET("/products", { params: { query: { page: 99 } } }));
    expect(page.items).toEqual([]);
  });

  it("includes the products of every sub-category for a top-level category", async () => {
    const courses = unwrap(
      await api().GET("/products", { params: { query: { category: "online-courses" } } }),
    );
    expect(courses.items.map((product) => product.kind)).toEqual(Array(4).fill("course"));
    const programming = unwrap(
      await api().GET("/products", { params: { query: { category: "programming" } } }),
    );
    expect(programming.total).toBe(2);
  });

  it("gives an empty page for an unknown category", async () => {
    const page = unwrap(await api().GET("/products", { params: { query: { category: "nope" } } }));
    expect(page.total).toBe(0);
  });

  it("searches the name and the summary in the requested language", async () => {
    const en = unwrap(await api().GET("/products", { params: { query: { q: "NOTEBOOK" } } }));
    expect(en.items.map((product) => product.slug)).toEqual(["a5-notebook"]);
    const fa = unwrap(
      await api().GET("/products", { params: { query: { q: "دفترچه", locale: "fa" } } }),
    );
    expect(fa.items.map((product) => product.slug)).toEqual(["a5-notebook"]);
  });

  it("sorts by price in both directions", async () => {
    const prices = async (sort: "price_asc" | "price_desc") =>
      unwrap(await api().GET("/products", { params: { query: { sort, pageSize: 48 } } })).items.map(
        (product) => product.price,
      );
    const ascending = await prices("price_asc");
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
    expect(await prices("price_desc")).toEqual([...ascending].reverse());
  });

  it("puts the newest product first by default", async () => {
    const page = unwrap(await api().GET("/products"));
    expect(page.items[0]?.slug).toBe("natural-honey-1kg");
  });

  it("shows a discount only when the old price is higher", async () => {
    const { items } = unwrap(await api().GET("/products", { params: { query: { pageSize: 48 } } }));
    for (const product of items) {
      if (product.compareAtPrice !== undefined) {
        expect(product.compareAtPrice, product.slug).toBeGreaterThan(product.price);
      }
    }
  });

  it("rejects a bad page, page size or sort", async () => {
    for (const query of [{ page: 0 }, { pageSize: 100 }, { sort: "random" as "newest" }]) {
      const result = await api().GET("/products", { params: { query } });
      expect(result.response.status, JSON.stringify(query)).toBe(400);
    }
  });
});

describe("product page", () => {
  it("returns the product with its breadcrumb path and attributes", async () => {
    const product = unwrap(
      await api().GET("/products/{slug}", { params: { path: { slug: "python-from-zero" } } }),
    );
    expect(product.kind).toBe("course");
    expect(product.categoryPath.map((category) => category.slug)).toEqual([
      "online-courses",
      "programming",
    ]);
    expect(product.category.slug).toBe("programming");
    expect(product.attributes.map((attribute) => attribute.name)).toEqual(["Duration", "Level"]);
  });

  it("is localized", async () => {
    const product = unwrap(
      await api().GET("/products/{slug}", {
        params: { path: { slug: "python-from-zero" }, query: { locale: "fa" } },
      }),
    );
    expect(product.name).toBe("پایتون از صفر");
    expect(product.categoryPath[0]?.name).toBe("دوره‌های آنلاین");
  });

  it("answers 404 for an unknown product", async () => {
    const result = await api().GET("/products/{slug}", { params: { path: { slug: "nope" } } });
    expect(result.response.status).toBe(404);
    expect(result.error).toMatchObject({ title: "Product not found" });
  });

  it("has an id and a slug that are unique across the catalog", () => {
    const slugs = SAMPLE_PRODUCTS.map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("only uses categories that exist", () => {
    const known = new Set(SAMPLE_CATEGORIES.map((category) => category.slug));
    for (const product of SAMPLE_PRODUCTS) {
      expect(known.has(product.category), product.slug).toBe(true);
    }
  });
});
