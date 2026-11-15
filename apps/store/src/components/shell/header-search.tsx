"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Input, SearchIcon } from "@front-dashboard/ui";
import { MAX_QUERY_LENGTH } from "../../features/catalog/query";
import { useRouter } from "../../i18n/navigation";

/** The wide search bar of the desktop header; Enter opens `/search?q=...`. */
export function HeaderSearch() {
  const t = useTranslations("search");
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = value.replace(/\s+/g, " ").trim();
    router.push(q ? { pathname: "/search", query: { q } } : "/search");
  }

  return (
    <form role="search" onSubmit={submit} className="relative mx-auto w-full max-w-2xl">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label={t("label")}
        placeholder={t("placeholder")}
        autoComplete="off"
        enterKeyHint="search"
        maxLength={MAX_QUERY_LENGTH}
        className="ps-10"
      />
    </form>
  );
}
