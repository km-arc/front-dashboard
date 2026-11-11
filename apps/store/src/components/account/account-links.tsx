"use client";

import { useTranslations } from "next-intl";
import { ChevronEndIcon, cn } from "@front-dashboard/ui";
import { accountNav, isActiveAccountPath, type AccountNavItem } from "../../config/navigation";
import { Link, usePathname } from "../../i18n/navigation";
import { ACCOUNT_ICONS } from "./account-icons";

type Variant = "row" | "sidebar";

const base: Record<Variant, string> = {
  row: "flex min-h-14 w-full items-center gap-3 px-4 text-base",
  sidebar: "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm",
};

function AccountLink({ item, variant }: { item: AccountNavItem; variant: Variant }) {
  const t = useTranslations("account");
  const shell = useTranslations("shell");
  const pathname = usePathname();
  const Icon = ACCOUNT_ICONS[item.id];
  const label = t(`nav.${item.id}`);
  const current = isActiveAccountPath(pathname, item);

  if (!item.available) {
    return (
      <span
        role="link"
        aria-disabled="true"
        className={cn(base[variant], "cursor-not-allowed text-muted-foreground opacity-60")}
      >
        <Icon className="size-5 shrink-0" />
        <span className="flex-1">{label}</span>
        <span className="text-xs">{shell("soon")}</span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        base[variant],
        "transition-colors",
        variant === "row" && "hover:bg-accent",
        variant === "sidebar" &&
          (current ? "bg-accent font-semibold text-primary" : "hover:bg-accent"),
      )}
    >
      <Icon className="size-5 shrink-0 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      {variant === "row" ? <ChevronEndIcon className="size-4 text-muted-foreground" /> : null}
    </Link>
  );
}

/** The account options as large rows: the account screen on phones. */
export function AccountRows() {
  const t = useTranslations("account");
  return (
    <nav aria-label={t("menu")}>
      <ul className="divide-y overflow-hidden rounded-lg border bg-card">
        {accountNav.map((item) => (
          <li key={item.id} className="flex">
            <AccountLink item={item} variant="row" />
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The account options as a side list: the dashboard on desktop. */
export function AccountSidebar() {
  const t = useTranslations("account");
  return (
    <nav aria-label={t("menu")}>
      <ul className="space-y-1">
        {accountNav.map((item) => (
          <li key={item.id}>
            <AccountLink item={item} variant="sidebar" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
