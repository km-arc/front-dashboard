/**
 * Single source of truth for store navigation: order, destinations and availability.
 * Labels live in messages/*.json under `shell.nav.<id>`.
 * To switch a destination on, set `available: true` in the step that builds its page.
 */
export type NavId = "home" | "categories" | "contact" | "search" | "cart" | "dashboard";

export interface NavItem {
  id: NavId;
  /** Path without the locale prefix. */
  href: string;
  available: boolean;
}

/** Places to browse: menu drawer, desktop header and footer. */
export const mainNav: readonly NavItem[] = [
  { id: "home", href: "/", available: true },
  { id: "categories", href: "/categories", available: false },
  { id: "contact", href: "/contact", available: false },
];

/** Frequent tools: always visible as icons in the header. */
export const utilityNav: readonly NavItem[] = [
  { id: "search", href: "/search", available: false },
  { id: "cart", href: "/cart", available: false },
  { id: "dashboard", href: "/dashboard", available: false },
];

/** `pathname` is the locale-less path from next-intl's `usePathname`. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
