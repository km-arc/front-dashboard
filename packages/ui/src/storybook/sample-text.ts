import { useLocale } from "../i18n/locale-provider";
import type { Locale } from "../i18n/locales";

/** Story-only sample copy, so RTL is reviewed with real Persian text. Not part of the public API. */
const SAMPLES = {
  en: {
    save: "Save",
    cancel: "Cancel",
    remove: "Delete",
    orders: "Orders",
    fresh: "New",
    failed: "Failed",
    title: "Order summary",
    description: "Three items, ready to ship.",
    body: "Total: 3 items",
    footer: "Updated today",
    name: "Full name",
    notify: "Email me updates",
  },
  fa: {
    save: "ذخیره",
    cancel: "انصراف",
    remove: "حذف",
    orders: "سفارش‌ها",
    fresh: "جدید",
    failed: "ناموفق",
    title: "خلاصهٔ سفارش",
    description: "سه کالا، آمادهٔ ارسال.",
    body: "جمع: ۳ کالا",
    footer: "امروز به‌روزرسانی شد",
    name: "نام و نام خانوادگی",
    notify: "به‌روزرسانی‌ها را ایمیل کن",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type SampleKey = keyof (typeof SAMPLES)["en"];

export function useSampleText(): Record<SampleKey, string> {
  return SAMPLES[useLocale().locale];
}
