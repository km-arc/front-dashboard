import { getLocale, getTranslations } from "next-intl/server";
import { isLocale } from "@front-dashboard/ui/locales";
import { utilityNav } from "../../config/navigation";
import { getCategories } from "../../features/catalog/api";
import { toMenuCategories, type MenuCategory } from "../../features/catalog/menu";
import { Link } from "../../i18n/navigation";
import { MegaMenu } from "../catalog/mega-menu";
import { AccountMenu } from "./account-menu";
import { HeaderSearch } from "./header-search";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { MobileSearch } from "./mobile-search";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

const quickLink =
  "inline-flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:text-foreground";

/** The categories for the menu. If the catalog cannot be read the menu is left out and the rest of the header works. */
async function loadMenu(): Promise<MenuCategory[]> {
  const locale = await getLocale();
  if (!isLocale(locale)) return [];
  try {
    return toMenuCategories((await getCategories(locale)).items);
  } catch {
    return [];
  }
}

/**
 * Phones: the menu button, the brand and a search field (the rest is the bottom tab bar).
 * From `md`, two rows. Row 1: brand, a wide search bar, the cart and the account. Row 2: the Categories button with its
 * large menu, quick links to the top-level categories, then language and theme.
 */
export async function SiteHeader() {
  const app = await getTranslations("app");
  const catalog = await getTranslations("catalog");
  const menu = await loadMenu();
  // The wide search bar replaces the search icon on desktop; the cart stays an icon.
  const tools = utilityNav.filter((item) => item.id === "cart");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-1 px-4 md:h-16 md:gap-4">
        <MobileMenu />
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center px-2 text-lg font-semibold"
        >
          {app("name")}
        </Link>
        <MobileSearch />
        <div className="hidden flex-1 md:block">
          <HeaderSearch />
        </div>
        <div className="hidden items-center gap-1 md:flex">
          {tools.map((item) => (
            <NavLink key={item.id} item={item} variant="icon" />
          ))}
          <AccountMenu />
        </div>
      </div>

      <div className="hidden border-t md:block">
        <div className="mx-auto flex h-11 w-full max-w-6xl items-center gap-2 px-4">
          {menu.length > 0 ? (
            <>
              <MegaMenu categories={menu} />
              <nav aria-label={catalog("menuLabel")}>
                <ul className="flex items-center gap-1">
                  {menu.map((category) => (
                    <li key={category.slug}>
                      <Link href={`/categories/${category.slug}`} className={quickLink}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          ) : null}
          <div className="ms-auto flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
