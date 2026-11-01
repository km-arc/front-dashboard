import type { Meta, StoryObj } from "@storybook/react-vite";
import { useDisclosureText } from "../../storybook/disclosure-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Disclosure/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function Example({ withDisabled, many }: { withDisabled?: boolean; many?: boolean }) {
  const t = useDisclosureText();
  const sections = [
    { value: "overview", label: t.overview, body: t.overviewBody },
    { value: "items", label: t.items, body: t.itemsBody },
    { value: "shipping", label: t.shipping, body: t.shippingBody },
    { value: "payments", label: t.payments, body: t.paymentsBody },
    { value: "history", label: t.history, body: t.historyBody },
  ];
  const extra = many
    ? Array.from({ length: 7 }, (_, i) => ({
        value: `extra-${i}`,
        label: `${t.history} ${i + 2}`,
        body: t.historyBody,
      }))
    : [];
  const all = [...sections, ...extra];
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label={t.tabsLabel}>
        {all.map((section) => (
          <TabsTrigger key={section.value} value={section.value}>
            {section.label}
          </TabsTrigger>
        ))}
        {withDisabled ? (
          <TabsTrigger value="archived" disabled>
            {t.disabled}
          </TabsTrigger>
        ) : null}
      </TabsList>
      {all.map((section) => (
        <TabsContent key={section.value} value={section.value}>
          <p className="text-sm text-muted-foreground">{section.body}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export const Default: Story = { render: () => <Example /> };
export const WithDisabledTab: Story = { render: () => <Example withDisabled /> };
/** Too many tabs for 360px: the list scrolls sideways; arrow keys still move between tabs. */
export const ManyTabsScroll: Story = { render: () => <Example many /> };
