import { getTranslations } from "next-intl/server";
import { mainNav } from "../../config/navigation";
import { NavLink } from "./nav-link";

export async function SiteFooter() {
  const app = await getTranslations("app");
  const t = await getTranslations("shell");

  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer", { name: app("name") })}</p>
        <nav aria-label={t("footerNav")}>
          <ul className="flex flex-wrap gap-x-2">
            {mainNav.map((item) => (
              <li key={item.id}>
                <NavLink
                  item={item}
                  className="inline-flex min-h-11 items-center px-2 hover:text-foreground"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
