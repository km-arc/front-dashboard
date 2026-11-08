"use client";

import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  LOCALES,
  LOCALE_INFO,
  isLocale,
  useLocale,
} from "@front-dashboard/ui";
import { getPathname, usePathname } from "../../i18n/navigation";

/**
 * Switches the language and stays on the same page.
 * It is a full page load on purpose: <html lang dir>, the fonts and the theme and brand tags in <head> belong to the
 * root layout, and React must not unmount and re-render that layout in place (it throws removeChild errors).
 */
export function LocaleSwitcher() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  function change(next: string) {
    if (!isLocale(next) || next === locale) return;
    setPending(true);
    const { search, hash } = window.location;
    window.location.assign(`${getPathname({ href: pathname, locale: next })}${search}${hash}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("language.label")} disabled={pending}>
          {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={change}>
          {LOCALES.map((code) => (
            <DropdownMenuRadioItem key={code} value={code} lang={code}>
              {LOCALE_INFO[code].nativeName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
