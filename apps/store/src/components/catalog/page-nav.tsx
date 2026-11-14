"use client";

import { useSearchParams } from "next/navigation";
import { Pagination } from "@front-dashboard/ui";
import { usePathname, useRouter } from "../../i18n/navigation";

/** Page buttons of a list; they change `?page=` and keep the other parts of the query. */
export function PageNav({ page, pageCount }: { page: number; pageCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const current = useSearchParams();

  if (pageCount <= 1) return null;

  return (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={(next) => {
        const query = Object.fromEntries(current.entries());
        if (next > 1) query.page = String(next);
        else delete query.page;
        router.push({ pathname, query });
      }}
    />
  );
}
