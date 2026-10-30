import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDisclosureText } from "../../storybook/disclosure-text";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "Disclosure/Accordion",
  component: Accordion,
  args: { type: "single" },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

function Example({ multiple, open }: { multiple?: boolean; open?: string }) {
  const t = useDisclosureText();
  const items = [
    { value: "shipping", question: t.faqShipping, answer: t.faqShippingBody },
    { value: "payment", question: t.faqPayment, answer: t.faqPaymentBody },
    { value: "returns", question: t.faqReturns, answer: t.faqReturnsBody },
    { value: "course", question: t.faqCourse, answer: t.faqCourseBody },
  ];
  const content = items.map((item) => (
    <AccordionItem key={item.value} value={item.value}>
      <AccordionTrigger>{item.question}</AccordionTrigger>
      <AccordionContent>{item.answer}</AccordionContent>
    </AccordionItem>
  ));
  return multiple ? (
    <Accordion type="multiple" defaultValue={open ? [open] : undefined}>
      {content}
    </Accordion>
  ) : (
    <Accordion defaultValue={open}>{content}</Accordion>
  );
}

/** Default behavior: one section open at a time, and it can be closed again. */
export const Single: Story = { render: () => <Example /> };
export const SingleFirstOpen: Story = { render: () => <Example open="shipping" /> };
export const Multiple: Story = { render: () => <Example multiple open="shipping" /> };
