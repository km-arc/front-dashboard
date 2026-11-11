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
  dashboard: { id: "dashboard", href: "/dashboard", available: true },
};

const pick = (...ids: NavId[]): readonly NavItem[] => ids.map((id) => items[id]);

/** Bottom tab bar on phones (below `md`). At most five tabs, like a native app. */
export const tabNav = pick("home", "categories", "search", "cart", "dashboard");

/** Drawer on phones: what the tab bar has no room for. */
export const drawerNav = pick("contact");

/** Places to browse on desktop: header links and footer. */
export const mainNav = pick("home", "categories", "contact");

/** Frequent tools on desktop: icons in the header (the account has its own menu there). */
export const utilityNav = pick("search", "cart");

/** `pathname` is the locale-less path from next-intl's `usePathname`. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type AccountNavId = "overview" | "orders" | "profile" | "addresses" | "wallet" | "support";

export interface AccountNavItem {
  id: AccountNavId;
  /** Path without the locale prefix. */
  href: string;
  available: boolean;
}

/** The options of the signed-in account: the header menu, the dashboard sidebar and the phone account screen. */
export const accountNav: readonly AccountNavItem[] = [
  { id: "overview", href: "/dashboard", available: true },
  { id: "orders", href: "/dashboard/orders", available: false },
  { id: "profile", href: "/dashboard/profile", available: false },
  { id: "addresses", href: "/dashboard/addresses", available: false },
  { id: "wallet", href: "/dashboard/wallet", available: false },
  { id: "support", href: "/dashboard/support", available: false },
];

/** The overview is only current on its own path; the other options also match their sub-pages. */
export function isActiveAccountPath(pathname: string, item: AccountNavItem): boolean {
  return item.id === "overview" ? pathname === item.href : isActivePath(pathname, item.href);
}
