import { useMemo } from "react";
import { useLocale } from "../i18n/locale-provider";

export type OrderStatus = "paid" | "pending" | "failed";

export interface DemoOrder {
  id: string;
  customer: string;
  status: OrderStatus;
  total: number;
}

const customers = {
  en: ["Sara Ahmadi", "Reza Karimi", "Maryam Hosseini", "Ali Rezaei", "Neda Moradi", "Omid Farhadi"],
  fa: ["سارا احمدی", "رضا کریمی", "مریم حسینی", "علی رضایی", "ندا مرادی", "امید فرهادی"],
};

const en = {
  caption: "Recent orders",
  customer: "Customer",
  status: "Status",
  total: "Total",
  filter: "Filter orders",
  emptyTitle: "No orders found",
  emptyBody: "Try a different search.",
  clear: "Clear filter",
  statusLabel: { paid: "Paid", pending: "Pending", failed: "Failed" } satisfies Record<
    OrderStatus,
    string
  >,
};

type DataTableText = typeof en;

const fa: DataTableText = {
  caption: "سفارش\u200cهای اخیر",
  customer: "مشتری",
  status: "وضعیت",
  total: "مبلغ کل",
  filter: "جستجوی سفارش\u200cها",
  emptyTitle: "سفارشی پیدا نشد",
  emptyBody: "عبارت دیگری را امتحان کنید.",
  clear: "پاک کردن فیلتر",
  statusLabel: { paid: "پرداخت\u200cشده", pending: "در انتظار", failed: "ناموفق" },
};

const copy = { en, fa };
const statuses: OrderStatus[] = ["paid", "pending", "failed"];

/** Localized demo data and labels for the table stories. Stable between renders. */
export function useDataTableText(count = 24) {
  const { locale, formatters } = useLocale();
  return useMemo(() => {
    const names = customers[locale];
    const orders: DemoOrder[] = Array.from({ length: count }, (_, i) => ({
      id: `order-${i + 1}`,
      customer: names[i % names.length] ?? "",
      status: statuses[i % statuses.length] ?? "paid",
      total: (i + 1) * 125_000 + (i % 5) * 7_000,
    }));
    return { ...copy[locale], orders, money: (amount: number) => formatters.money(amount, "IRT") };
  }, [locale, formatters, count]);
}
