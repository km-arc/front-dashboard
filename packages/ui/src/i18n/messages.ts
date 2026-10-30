import type { Locale } from "./locales";

/** Strings used inside @front-dashboard/ui components. App-level strings live in the apps' own messages. */
const en = {
  "common.close": "Close",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.search": "Search",
  "common.loading": "Loading…",
  "common.noResults": "No results found",
  "common.required": "Required",
  "common.optional": "Optional",
  "common.back": "Back",
  "common.next": "Next",
  "common.previous": "Previous",
  "common.more": "More",
  "common.retry": "Try again",
  "common.error": "Something went wrong",
  "pagination.pageOf": "Page {page} of {total}",
  "pagination.previous": "Previous page",
  "pagination.next": "Next page",
  "a11y.skipToContent": "Skip to main content",
  "a11y.openMenu": "Open menu",
  "a11y.closeMenu": "Close menu",
  "a11y.pagination": "Pagination",
  "pagination.page": "Page {page}",
  "table.selectAll": "Select all rows on this page",
  "table.selectRow": "Select row",
  "table.selectedCount": "{count} of {total} selected",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",
  "theme.toggle": "Toggle theme",
  "language.label": "Language",
  "table.empty": "No data to display",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;

const fa: Messages = {
  "common.close": "بستن",
  "common.cancel": "لغو",
  "common.confirm": "تأیید",
  "common.save": "ذخیره",
  "common.delete": "حذف",
  "common.edit": "ویرایش",
  "common.search": "جستجو",
  "common.loading": "در حال بارگذاری…",
  "common.noResults": "نتیجه\u200cای یافت نشد",
  "common.required": "الزامی",
  "common.optional": "اختیاری",
  "common.back": "بازگشت",
  "common.next": "بعدی",
  "common.previous": "قبلی",
  "common.more": "بیشتر",
  "common.retry": "تلاش دوباره",
  "common.error": "خطایی رخ داد",
  "pagination.pageOf": "صفحه {page} از {total}",
  "pagination.previous": "صفحه قبل",
  "pagination.next": "صفحه بعد",
  "a11y.skipToContent": "رفتن به محتوای اصلی",
  "a11y.openMenu": "باز کردن منو",
  "a11y.closeMenu": "بستن منو",
  "a11y.pagination": "صفحه\u200cبندی",
  "pagination.page": "صفحهٔ {page}",
  "table.selectAll": "انتخاب همه\u200cی ردیف\u200cهای این صفحه",
  "table.selectRow": "انتخاب ردیف",
  "table.selectedCount": "{count} از {total} انتخاب شده",
  "theme.light": "روشن",
  "theme.dark": "تاریک",
  "theme.system": "مطابق سیستم",
  "theme.toggle": "تغییر تم",
  "language.label": "زبان",
  "table.empty": "داده\u200cای برای نمایش وجود ندارد",
};

export const uiMessages: Readonly<Record<Locale, Messages>> = { en, fa };

export type MessageValues = Readonly<Record<string, string | number>>;

/** Replaces `{name}` placeholders. Unknown placeholders are left untouched. Format numbers/dates beforehand. */
export function formatMessage(template: string, values?: MessageValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = values[name];
    return value === undefined ? match : String(value);
  });
}
