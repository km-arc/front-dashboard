import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSampleText } from "../../storybook/sample-text";
import { Alert, AlertDescription, AlertTitle, type AlertProps } from "./alert";

type Variant = NonNullable<AlertProps["variant"]>;
// Cast on purpose: a variant that does not exist simply renders with the default style.
const variants = ["default", "success", "warning", "destructive"] as Variant[];

const meta = {
  title: "Overlays/Alert",
  component: Alert,
  argTypes: { variant: { control: "select", options: variants } },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

function Message(props: AlertProps) {
  const t = useSampleText();
  return (
    <Alert {...props}>
      <AlertTitle>{t.title}</AlertTitle>
      <AlertDescription>{t.description}</AlertDescription>
    </Alert>
  );
}

function AllVariants() {
  return (
    <div className="flex w-96 max-w-full flex-col gap-3">
      {variants.map((variant) => (
        <Message key={variant} variant={variant} />
      ))}
    </div>
  );
}

export const Default: Story = { render: (args) => <Message {...args} /> };
export const AllAlertVariants: Story = { render: () => <AllVariants /> };
