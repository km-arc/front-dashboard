import { getTranslations } from "next-intl/server";
import { mainNav, utilityNav } from "../../config/navigation";
import { Link } from "../../i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

const desktopLink =
  "inline-flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:text-foreground";

/** Phones: menu and brand (navigation is the bottom tab bar). From `md`: brand, links, tools, language, theme. */
export async function SiteHeader() {
  const app = await getTranslations("app");
  const t = await getTranslations("shell");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-1 px-4">
        <MobileMenu />
        <Link
          href="/"
          className="me-auto inline-flex min-h-11 items-center px-2 text-lg font-semibold md:me-4"
        >
          {app("name")}
        </Link>
        <nav aria-label={t("mainNav")} className="me-auto hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <NavLink key={item.id} item={item} className={desktopLink} />
          ))}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          {utilityNav.map((item) => (
            <NavLink key={item.id} item={item} variant="icon" />
          ))}
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
