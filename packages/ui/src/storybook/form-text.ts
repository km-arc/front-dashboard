import { useLocale } from "../i18n/locale-provider";
import type { Locale } from "../i18n/locales";

/** Story-only sample copy for form primitives (English and Persian). Not part of the public API. */
const FORM_TEXT = {
  en: {
    label: "Full name",
    placeholder: "Type here",
    email: "Email",
    emailValue: "name@example.com",
    quantity: "Quantity",
    invalid: "Invalid value",
    accept: "I accept the terms",
    offers: "Send me offers",
    plan: "Plan",
    free: "Free",
    pro: "Pro",
    team: "Team",
    notifications: "Notifications",
    country: "Country",
    choose: "Choose a country",
    asia: "Asia",
    europe: "Europe",
    iran: "Iran",
    japan: "Japan",
    germany: "Germany",
    france: "France",
  },
  fa: {
    label: "نام و نام خانوادگی",
    placeholder: "اینجا بنویسید",
    email: "ایمیل",
    emailValue: "name@example.com",
    quantity: "تعداد",
    invalid: "مقدار نامعتبر",
    accept: "شرایط را می‌پذیرم",
    offers: "پیشنهادها را برایم بفرست",
    plan: "طرح",
    free: "رایگان",
    pro: "حرفه‌ای",
    team: "تیمی",
    notifications: "اعلان‌ها",
    country: "کشور",
    choose: "یک کشور انتخاب کنید",
    asia: "آسیا",
    europe: "اروپا",
    iran: "ایران",
    japan: "ژاپن",
    germany: "آلمان",
    france: "فرانسه",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type FormTextKey = keyof (typeof FORM_TEXT)["en"];

export function useFormText(): Record<FormTextKey, string> {
  return FORM_TEXT[useLocale().locale];
}
