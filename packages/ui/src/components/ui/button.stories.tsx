import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSampleText } from "../../storybook/sample-text";
import { Button, type ButtonProps } from "./button";

type Variant = NonNullable<ButtonProps["variant"]>;
type Size = NonNullable<ButtonProps["size"]>;

const variants: Variant[] = ["default", "destructive", "outline", "secondary", "ghost", "link"];
const sizes: Size[] = ["default", "sm", "lg", "icon"];

const meta = {
  title: "Primitives/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

function Playground(props: ButtonProps) {
  const t = useSampleText();
  return <Button {...props}>{t.save}</Button>;
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function Variants({ disabled }: { disabled?: boolean }) {
  const t = useSampleText();
  return (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} variant={variant} disabled={disabled}>
          {t.save}
        </Button>
      ))}
    </div>
  );
}

function Sizes() {
  const t = useSampleText();
  return (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) =>
        size === "icon" ? (
          <Button key={size} size={size} aria-label={t.save}>
            <PlusIcon />
          </Button>
        ) : (
          <Button key={size} size={size}>
            {t.save}
          </Button>
        ),
      )}
    </div>
  );
}

function AsLink() {
  const t = useSampleText();
  return (
    <Button asChild>
      <a href="#orders">{t.orders}</a>
    </Button>
  );
}

export const Default: Story = { render: (args) => <Playground {...args} /> };
export const AllVariants: Story = { render: () => <Variants /> };
export const AllSizes: Story = { render: () => <Sizes /> };
export const Disabled: Story = { render: () => <Variants disabled /> };
export const RenderedAsLink: Story = { render: () => <AsLink /> };
