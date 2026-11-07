"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Button,
  MenuIcon,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  useLocale,
} from "@front-dashboard/ui";
import { mainNav } from "../../config/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

const linkClass =
  "flex min-h-11 items-center rounded-md px-3 text-base text-muted-foreground hover:bg-accent hover:text-foreground";

/** Navigation drawer for small screens; from `md` the header shows the links inline instead. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("shell");
  const { t: ui } = useLocale();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={ui("a11y.openMenu")}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="start" closeLabel={ui("a11y.closeMenu")} aria-describedby={undefined}>
        <SheetTitle>{t("menu")}</SheetTitle>
        <nav aria-label={t("menu")} className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              className={linkClass}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 border-t pt-4">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
