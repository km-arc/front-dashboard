/**
 * Single source of truth for store navigation: destinations, availability and the order of each surface.
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

const items: Record<NavId, NavItem> = {
  home: { id: "home", href: "/", available: true },
  categories: { id: "categories", href: "/categories", available: false },
  contact: { id: "contact", href: "/contact", available: false },
  search: { id: "search", href: "/search", available: false },
  cart: { id: "cart", href: "/cart", available: false },
  dashboard: { id: "dashboard", href: "/dashboard", available: false },
};

const pick = (...ids: NavId[]): readonly NavItem[] => ids.map((id) => items[id]);

/** Bottom tab bar on phones (below `md`). At most five tabs, like a native app. */
export const tabNav = pick("home", "categories", "search", "cart", "dashboard");

/** Drawer on phones: what the tab bar has no room for. */
export const drawerNav = pick("contact");

/** Places to browse on desktop: header links and footer. */
export const mainNav = pick("home", "categories", "contact");

/** Frequent tools on desktop: icons in the header. */
export const utilityNav = pick("search", "cart", "dashboard");

/** `pathname` is the locale-less path from next-intl's `usePathname`. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
