"use client";

import { useTranslations } from "next-intl";
import { SearchIcon } from "@front-dashboard/ui";
import { Link } from "../../i18n/navigation";

/** The search field of the phone top bar: a tap opens the search page, where the keyboard is already waiting. */
export function MobileSearch() {
  const t = useTranslations("search");

  return (
    <Link
      href="/search"
      aria-label={t("label")}
      className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border bg-muted/50 px-3 text-sm text-muted-foreground md:hidden"
    >
      <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
      <span className="truncate">{t("placeholder")}</span>
    </Link>
  );
}
