import { useLocale } from "../i18n/locale-provider";
import type { Locale } from "../i18n/locales";

/** Story-only copy and validation messages for the signup form example (English and Persian). */
const SIGNUP_TEXT = {
  en: {
    name: "Full name",
    nameHint: "As written on your ID",
    nameShort: "Enter at least 2 characters",
    email: "Email",
    emailInvalid: "Enter a valid email address",
    country: "Country",
    choose: "Choose a country",
    countryRequired: "Choose a country",
    iran: "Iran",
    germany: "Germany",
    plan: "Plan",
    free: "Free",
    pro: "Pro",
    planRequired: "Choose a plan",
    notifications: "Email notifications",
    accept: "I accept the terms",
    acceptRequired: "You must accept the terms",
    save: "Create account",
    success: "Account created",
  },
  fa: {
    name: "نام و نام خانوادگی",
    nameHint: "مطابق کارت ملی",
    nameShort: "حداقل ۲ نویسه وارد کنید",
    email: "ایمیل",
    emailInvalid: "یک نشانی ایمیل معتبر وارد کنید",
    country: "کشور",
    choose: "یک کشور انتخاب کنید",
    countryRequired: "کشور را انتخاب کنید",
    iran: "ایران",
    germany: "آلمان",
    plan: "طرح",
    free: "رایگان",
    pro: "حرفه‌ای",
    planRequired: "یک طرح انتخاب کنید",
    notifications: "اعلان‌های ایمیلی",
    accept: "شرایط را می‌پذیرم",
    acceptRequired: "باید شرایط را بپذیرید",
    save: "ساخت حساب",
    success: "حساب ساخته شد",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type SignupTextKey = keyof (typeof SIGNUP_TEXT)["en"];

export function useSignupText(): Record<SignupTextKey, string> {
  return SIGNUP_TEXT[useLocale().locale];
}
