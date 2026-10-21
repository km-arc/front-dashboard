import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSampleText } from "../../storybook/sample-text";
import { Label } from "./label";

const meta = {
  title: "Primitives/Label",
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

const field = "h-11 rounded-md border border-input bg-background px-3";

function WithInput() {
  const t = useSampleText();
  return (
    <div className="flex w-72 max-w-full flex-col gap-2">
      <Label htmlFor="sb-name">{t.name}</Label>
      <input id="sb-name" className={field} />
    </div>
  );
}

function DisabledControl() {
  const t = useSampleText();
  return (
    <div className="flex items-center gap-2">
      <input id="sb-notify" type="checkbox" className="peer size-4" disabled />
      <Label htmlFor="sb-notify">{t.notify}</Label>
    </div>
  );
}

export const WithInputField: Story = { render: () => <WithInput /> };
export const PeerDisabled: Story = { render: () => <DisabledControl /> };
