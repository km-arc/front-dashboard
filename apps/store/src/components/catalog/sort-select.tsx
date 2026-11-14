"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@front-dashboard/ui";
import { SORTS, type Sort } from "../../features/catalog/query";
import { usePathname, useRouter } from "../../i18n/navigation";

/** Changes the sort in the URL (and goes back to the first page), so the list can be shared and bookmarked. */
export function SortSelect({ value }: { value: Sort }) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const pathname = usePathname();
  const current = useSearchParams();

  function change(next: string) {
    const query = Object.fromEntries(current.entries());
    delete query.page;
    if (next === "newest") delete query.sort;
    else query.sort = next;
    router.push({ pathname, query });
  }

  return (
    <Select value={value} onValueChange={change}>
      <SelectTrigger className="w-48" aria-label={t("sortLabel")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORTS.map((sort) => (
          <SelectItem key={sort} value={sort}>
            {t(`sort.${sort}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
