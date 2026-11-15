"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button, Input } from "@front-dashboard/ui";
import { MAX_QUERY_LENGTH } from "../../features/catalog/query";
import { useRouter } from "../../i18n/navigation";

/** The search field: it opens the results page (`/search?q=...`); an empty search opens the page without results. */
export function SearchForm({
  initialQuery,
  autoFocus = false,
}: {
  initialQuery: string;
  autoFocus?: boolean;
}) {
  const t = useTranslations("search");
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = value.replace(/\s+/g, " ").trim();
    router.push(q ? { pathname: "/search", query: { q } } : "/search");
  }

  return (
    <form role="search" onSubmit={submit} className="flex gap-2">
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
        autoFocus={autoFocus}
        className="flex-1"
      />
      <Button type="submit">{t("button")}</Button>
    </form>
  );
}
