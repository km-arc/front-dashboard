"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { Button, ChevronEndIcon, MenuIcon, cn } from "@front-dashboard/ui";
import type { MenuCategory } from "../../features/catalog/menu";
import { Link, usePathname } from "../../i18n/navigation";

const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 220;

/**
 * The "Categories" button of the desktop header and its large panel: the top-level categories on one side and the
 * sub-categories of the one you point at or focus on, on the other. It opens on hover (with a short delay, mouse only),
 * on click or tap, and closes on Escape, on a click outside, when focus leaves it and after a navigation.
 * A disclosure, not an ARIA menu: every entry is a normal link, so Tab and screen readers work as on any list of links.
 */
export function MegaMenu({ categories }: { categories: MenuCategory[] }) {
  const t = useTranslations("catalog");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const active = categories.find((category) => category.slug === activeSlug) ?? categories[0];

  function later(next: boolean, delay: number) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  }

  useEffect(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, [pathname]);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function onBlur(event: FocusEvent) {
    if (!root.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
  }

  if (!active) return null;

  return (
    <div
      ref={root}
      onBlur={onBlur}
      onPointerEnter={(event) => event.pointerType === "mouse" && later(true, OPEN_DELAY_MS)}
      onPointerLeave={(event) => event.pointerType === "mouse" && later(false, CLOSE_DELAY_MS)}
    >
      <Button
        ref={trigger}
        type="button"
        variant="ghost"
        aria-expanded={open}
        aria-controls="mega-menu-panel"
        onClick={() => {
          clearTimeout(timer.current);
          setOpen((current) => !current);
        }}
      >
        <MenuIcon />
        {t("title")}
      </Button>

      {open ? (
        <div
          id="mega-menu-panel"
          className="absolute inset-x-0 top-full z-50 border-b bg-background shadow-lg"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-[16rem_minmax(0,1fr)] gap-6 px-4 py-4">
            <ul className="space-y-1 border-e pe-4">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    onFocus={() => setActiveSlug(category.slug)}
                    onPointerEnter={() => setActiveSlug(category.slug)}
                    className={cn(
                      "flex min-h-11 items-center justify-between gap-2 rounded-md px-3 text-sm",
                      category.slug === active.slug
                        ? "bg-accent font-semibold text-primary"
                        : "hover:bg-accent",
                    )}
                  >
                    {category.name}
                    <ChevronEndIcon className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <Link
                href={`/categories/${active.slug}`}
                className="inline-flex min-h-11 items-center font-semibold text-primary"
              >
                {t("viewAll", { name: active.name })}
              </Link>
              <ul className="mt-2 grid grid-cols-3 gap-x-6 gap-y-1">
                {active.children.map((child) => (
                  <li key={child.slug}>
                    <Link
                      href={`/categories/${child.slug}`}
                      className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
