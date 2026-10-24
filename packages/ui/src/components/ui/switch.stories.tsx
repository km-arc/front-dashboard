import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useFormText } from "../../storybook/form-text";
import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({ id, ...props }: ComponentProps<typeof Switch> & { id: string }) {
  const t = useFormText();
  return (
    <div className="flex items-center gap-3">
      <Switch id={id} {...props} />
      <Label htmlFor={id}>{t.notifications}</Label>
    </div>
  );
}

export const Off: Story = { render: () => <Row id="sb-sw-off" /> };
export const On: Story = { render: () => <Row id="sb-sw-on" defaultChecked /> };
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Row id="sb-sw-dis-off" disabled />
      <Row id="sb-sw-dis-on" disabled defaultChecked />
    </div>
  ),
};
