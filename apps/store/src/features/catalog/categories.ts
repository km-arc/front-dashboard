import type { components } from "@front-dashboard/api";

export type Category = components["schemas"]["Category"];

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

/** The flat list the API returns as a tree, keeping the order of the list. */
export function buildTree(items: readonly Category[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>(
    items.map((item) => [item.slug, { ...item, children: [] }]),
  );
  const roots: CategoryNode[] = [];
  for (const item of items) {
    const node = nodes.get(item.slug);
    if (!node) continue;
    const parent = item.parentSlug ? nodes.get(item.parentSlug) : undefined;
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}

/** The category and its ancestors, from the top-level category down; empty for an unknown slug. */
export function pathTo(items: readonly Category[], slug: string): Category[] {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const path: Category[] = [];
  for (let current = bySlug.get(slug); current; current = bySlug.get(current.parentSlug ?? "")) {
    path.unshift(current);
  }
  return path;
}

export function childrenOf(items: readonly Category[], slug: string): Category[] {
  return items.filter((item) => item.parentSlug === slug);
}
