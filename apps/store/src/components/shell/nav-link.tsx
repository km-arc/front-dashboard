"use client";

import { useTranslations } from "next-intl";
import type { ComponentType, SVGProps } from "react";
import { Button, CartIcon, SearchIcon, UserIcon, cn } from "@front-dashboard/ui";
import { isActivePath, type NavId, type NavItem } from "../../config/navigation";
import { Link, usePathname } from "../../i18n/navigation";

const ICONS: Partial<Record<NavId, ComponentType<SVGProps<SVGSVGElement>>>> = {
  search: SearchIcon,
  cart: CartIcon,
  dashboard: UserIcon,
};

export interface NavLinkProps {
  item: NavItem;
  /** Icon-only button (header tools); the label becomes its accessible name. */
  iconOnly?: boolean;
  className?: string;
  /** Called after a click on an available link, e.g. to close the drawer. */
  onNavigate?: () => void;
}

/** One navigation destination. Unavailable ones render disabled instead of linking to a 404. */
export function NavLink({ item, iconOnly = false, className, onNavigate }: NavLinkProps) {
  const t = useTranslations("shell");
  const pathname = usePathname();
  const label = t(`nav.${item.id}`);
  const Icon = ICONS[item.id];
  const current = isActivePath(pathname, item.href) ? "page" : undefined;

  if (iconOnly && Icon) {
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
