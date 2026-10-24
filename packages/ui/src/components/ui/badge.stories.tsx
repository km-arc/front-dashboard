import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSampleText } from "../../storybook/sample-text";
import { Badge, type BadgeProps } from "./badge";

type Variant = NonNullable<BadgeProps["variant"]>;
const variants: Variant[] = ["default", "secondary", "destructive", "outline"];

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  argTypes: { variant: { control: "select", options: variants } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

function Playground(props: BadgeProps) {
  const t = useSampleText();
  return <Badge {...props}>{t.fresh}</Badge>;
}

function Variants() {
  const t = useSampleText();
  return (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant === "destructive" ? t.failed : t.fresh}
        </Badge>
      ))}
    </div>
  );
}

export const Default: Story = { render: (args) => <Playground {...args} /> };
export const AllVariants: Story = { render: () => <Variants /> };
