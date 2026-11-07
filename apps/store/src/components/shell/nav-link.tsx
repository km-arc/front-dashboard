"use client";

import { useTranslations } from "next-intl";
import type { ComponentType, SVGProps } from "react";
import {
  Button,
  CartIcon,
  GridIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
  cn,
} from "@front-dashboard/ui";
import { isActivePath, type NavId, type NavItem } from "../../config/navigation";
import { Link, usePathname } from "../../i18n/navigation";

const ICONS: Partial<Record<NavId, ComponentType<SVGProps<SVGSVGElement>>>> = {
  home: HomeIcon,
  categories: GridIcon,
  search: SearchIcon,
  cart: CartIcon,
  dashboard: UserIcon,
};

const tabClass =
  "flex min-h-14 w-full flex-col items-center justify-center gap-1 px-1 text-xs transition-colors";

/** text: link with a label. icon: icon-only button. tab: icon above a label (bottom tab bar). */
export type NavLinkVariant = "text" | "icon" | "tab";

export interface NavLinkProps {
  item: NavItem;
  variant?: NavLinkVariant;
  className?: string;
  /** Called after a click on an available link, e.g. to close the drawer. */
  onNavigate?: () => void;
}

/** One navigation destination. Unavailable ones render disabled instead of linking to a 404. */
export function NavLink({ item, variant = "text", className, onNavigate }: NavLinkProps) {
  const t = useTranslations("shell");
  const pathname = usePathname();
  const label = t(`nav.${item.id}`);
  const Icon = ICONS[item.id];
  const current = isActivePath(pathname, item.href) ? "page" : undefined;

  if (variant === "icon" && Icon) {
    if (!item.available) {
      return (
        <Button
          variant="ghost"
          size="icon"
          disabled
          aria-label={`${label} (${t("soon")})`}
          className={className}
        >
          <Icon />
        </Button>
      );
    }
    return (
      <Button asChild variant="ghost" size="icon" className={className}>
        <Link href={item.href} aria-label={label} aria-current={current} onClick={onNavigate}>
          <Icon />
        </Link>
      </Button>
    );
  }

  if (variant === "tab" && Icon) {
    if (!item.available) {
      return (
        <span
          role="link"
          aria-disabled="true"
          className={cn(tabClass, "cursor-not-allowed text-muted-foreground opacity-50", className)}
        >
          <Icon className="size-6" />
          <span>{label}</span>
          <span className="sr-only">({t("soon")})</span>
        </span>
      );
    }
    return (
      <Link
        href={item.href}
        aria-current={current}
        onClick={onNavigate}
        className={cn(
          tabClass,
          current ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground",
          className,
        )}
      >
        <Icon className="size-6" />
        <span>{label}</span>
      </Link>
    );
  }

  if (!item.available) {
    return (
      <span
        role="link"
        aria-disabled="true"
        className={cn(className, "cursor-not-allowed opacity-50")}
      >
        {label}
        <span className="sr-only"> ({t("soon")})</span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={current}
      onClick={onNavigate}
      className={cn(className, current && "font-semibold text-foreground")}
    >
      {label}
    </Link>
  );
}
