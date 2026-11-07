import { getTranslations } from "next-intl/server";
import { tabNav } from "../../config/navigation";
import { NavLink } from "./nav-link";

/**
 * App-style tab bar fixed to the bottom of phone screens (hidden from `md`).
 * The bottom padding keeps it clear of the home indicator (needs `viewportFit: "cover"`, see the layout).
 */
export async function BottomNav() {
  const t = await getTranslations("shell");

  return (
    <nav
      aria-label={t("tabNav")}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
    >
      <ul className="mx-auto flex max-w-md">
        {tabNav.map((item) => (
          <li key={item.id} className="flex flex-1">
            <NavLink item={item} variant="tab" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
