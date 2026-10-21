import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useFormText } from "../../storybook/form-text";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({
  id,
  label,
  ...props
}: ComponentProps<typeof Checkbox> & { id: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} {...props} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

function Unchecked() {
  const t = useFormText();
  return <Row id="sb-cb-off" label={t.accept} />;
}

function Checked() {
  const t = useFormText();
  return <Row id="sb-cb-on" label={t.accept} defaultChecked />;
}

function Indeterminate() {
  const t = useFormText();
  return <Row id="sb-cb-mixed" label={t.offers} checked="indeterminate" />;
}

function Disabled() {
  const t = useFormText();
  return (
    <div className="flex flex-col gap-3">
      <Row id="sb-cb-dis-off" label={t.accept} disabled />
      <Row id="sb-cb-dis-on" label={t.offers} disabled defaultChecked />
    </div>
  );
}

export const Default: Story = { render: () => <Unchecked /> };
export const CheckedState: Story = { render: () => <Checked /> };
export const IndeterminateState: Story = { render: () => <Indeterminate /> };
export const DisabledStates: Story = { render: () => <Disabled /> };
