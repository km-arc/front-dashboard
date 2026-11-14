import { describe, expect, it } from "vitest";
import { buildTree, childrenOf, pathTo, type Category } from "./categories";

const category = (slug: string, parentSlug?: string): Category => ({
  slug,
  name: slug,
  productCount: 1,
  ...(parentSlug ? { parentSlug } : {}),
});

const items = [
  category("a"),
  category("a1", "a"),
  category("a2", "a"),
  category("b"),
  category("b1", "b"),
];

describe("buildTree", () => {
  it("nests the children under their parent and keeps the order", () => {
    const tree = buildTree(items);
    expect(tree.map((node) => node.slug)).toEqual(["a", "b"]);
    expect(tree[0]?.children.map((node) => node.slug)).toEqual(["a1", "a2"]);
    expect(tree[1]?.children.map((node) => node.slug)).toEqual(["b1"]);
  });

  it("treats a category whose parent is missing as a top-level one", () => {
    expect(buildTree([category("x", "missing")]).map((node) => node.slug)).toEqual(["x"]);
  });
});

describe("pathTo", () => {
  it("goes from the top-level category down to the one asked for", () => {
    expect(pathTo(items, "a2").map((node) => node.slug)).toEqual(["a", "a2"]);
    expect(pathTo(items, "b").map((node) => node.slug)).toEqual(["b"]);
  });

  it("is empty for an unknown slug", () => {
    expect(pathTo(items, "nope")).toEqual([]);
  });
});

describe("childrenOf", () => {
  it("lists the direct children only", () => {
    expect(childrenOf(items, "a").map((node) => node.slug)).toEqual(["a1", "a2"]);
    expect(childrenOf(items, "a1")).toEqual([]);
  });
});
