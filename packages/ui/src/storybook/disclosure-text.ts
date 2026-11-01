import { useLocale } from "../i18n/locale-provider";

/** Sample copy for the Tabs and Accordion stories (en + fa, kept in sync by the type). */
const en = {
  tabsLabel: "Order sections",
  overview: "Overview",
  items: "Items",
  shipping: "Shipping",
  payments: "Payments",
  history: "History",
  disabled: "Archived",
  overviewBody: "A summary of the order and its current status.",
  itemsBody: "The products in this order, with quantities and prices.",
  shippingBody: "Where the order ships from and its tracking details.",
  paymentsBody: "How the order was paid: gateway, card to card or cheque.",
  historyBody: "Every change made to the order, newest first.",
  faqShipping: "How long does shipping take?",
  faqShippingBody: "Orders usually arrive within three to five working days.",
  faqPayment: "Which payment methods do you accept?",
  faqPaymentBody: "Online gateway, card to card and cheque.",
  faqReturns: "Can I return a product?",
  faqReturnsBody: "Physical products can be returned within seven days if unused.",
  faqCourse: "How long do I keep access to a course?",
  faqCourseBody: "Access lasts for the period shown on the course page after you enroll.",
};

type DisclosureText = typeof en;

const fa: DisclosureText = {
  tabsLabel: "بخش\u200cهای سفارش",
  overview: "خلاصه",
  items: "اقلام",
  shipping: "ارسال",
  payments: "پرداخت\u200cها",
  history: "تاریخچه",
  disabled: "بایگانی\u200cشده",
  overviewBody: "خلاصه‌ی سفارش و وضعیت فعلی آن.",
  itemsBody: "محصولات این سفارش، همراه با تعداد و قیمت.",
  shippingBody: "مبدأ ارسال سفارش و اطلاعات پیگیری.",
  paymentsBody: "روش پرداخت سفارش: درگاه، کارت به کارت یا چک.",
  historyBody: "همه‌ی تغییرات سفارش، از جدیدترین.",
  faqShipping: "ارسال چقدر طول می‌کشد؟",
  faqShippingBody: "سفارش‌ها معمولاً ظرف سه تا پنج روز کاری می‌رسند.",
  faqPayment: "چه روش‌های پرداختی دارید؟",
  faqPaymentBody: "درگاه آنلاین، کارت به کارت و چک.",
  faqReturns: "آیا می‌توانم محصول را برگردانم؟",
  faqReturnsBody: "محصولات فیزیکی در صورت استفاده‌نشدن تا هفت روز قابل بازگشت‌اند.",
  faqCourse: "تا کی به دوره دسترسی دارم؟",
  faqCourseBody: "پس از ثبت‌نام، دسترسی به مدت نمایش‌داده‌شده در صفحه‌ی دوره است.",
};

const texts = { en, fa };

/** Text for the active toolbar locale. Needs LocaleProvider (the story decorator provides it). */
export function useDisclosureText(): DisclosureText {
  return texts[useLocale().locale];
}
