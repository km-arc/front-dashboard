import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocale } from "../../i18n/locale-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Data display/Tabs",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TEXT = {
  en: {
    label: "Order sections",
    tabs: ["Overview", "Details", "Reviews", "Shipping", "Returns", "Support"],
    body: "Order summary and status.",
  },
  fa: {
    label: "بخش‌های سفارش",
    tabs: ["نمای کلی", "جزئیات", "نظرها", "ارسال", "مرجوعی", "پشتیبانی"],
    body: "خلاصه و وضعیت سفارش.",
  },
} as const;

function Demo({ count }: { count: number }) {
  const { locale } = useLocale();
  const t = TEXT[locale];
  const tabs = t.tabs.slice(0, count);
  return (
    <Tabs defaultValue="0" className="w-96 max-w-full">
      <TabsList aria-label={t.label}>
        {tabs.map((label, index) => (
          <TabsTrigger key={label} value={String(index)}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((label, index) => (
        <TabsContent key={label} value={String(index)}>
          <p className="text-sm">
            {label}: {t.body}
          </p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

/** Arrow keys follow the reading direction: in fa, the left arrow moves to the next tab. */
export const Default: Story = { render: () => <Demo count={3} /> };
/** More tabs than fit: the list scrolls sideways inside its box. */
export const ManyTabs: Story = {
  render: () => (
    <div className="w-72 max-w-full">
      <Demo count={6} />
    </div>
  ),
};
