import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocale } from "../../i18n/locale-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "Data display/Accordion",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TEXT = {
  en: [
    { q: "How do I track my order?", a: "Open Orders and select the shipment to see its status." },
    { q: "Can I change my address?", a: "Yes, until the order is handed to the carrier." },
    { q: "How do refunds work?", a: "Refunds return to the original payment method within a week." },
  ],
  fa: [
    { q: "چطور سفارشم را پیگیری کنم؟", a: "به بخش سفارش‌ها بروید و مرسوله را برای دیدن وضعیت باز کنید." },
    { q: "آیا می‌توانم نشانی را عوض کنم؟", a: "بله، تا پیش از تحویل بسته به شرکت حمل‌ونقل." },
    { q: "بازپرداخت چگونه انجام می‌شود؟", a: "مبلغ تا یک هفته به روش پرداخت اولیه برمی‌گردد." },
  ],
} as const;

function Items() {
  const { locale } = useLocale();
  return (
    <>
      {TEXT[locale].map((item, index) => (
        <AccordionItem key={item.q} value={`item-${index}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-0" className="w-96 max-w-full">
      <Items />
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["item-0", "item-1"]} className="w-96 max-w-full">
      <Items />
    </Accordion>
  ),
};
