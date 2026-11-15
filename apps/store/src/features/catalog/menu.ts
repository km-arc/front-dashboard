import { buildTree, type Category } from "./categories";

/** A top-level category with its direct sub-categories, as plain data for the mega menu (safe to pass to the client). */
export interface MenuCategory {
  slug: string;
  name: string;
  productCount: number;
  children: { slug: string; name: string }[];
}

export function toMenuCategories(items: readonly Category[]): MenuCategory[] {
  return buildTree(items).map((top) => ({
    slug: top.slug,
    name: top.name,
    productCount: top.productCount,
    children: top.children.map((child) => ({ slug: child.slug, name: child.name })),
  }));
}
