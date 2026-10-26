import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSampleText } from "../../storybook/sample-text";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ defaultOpen }: { defaultOpen?: boolean }) {
  const t = useSampleText();
  return (
    <Tooltip defaultOpen={defaultOpen}>
      <TooltipTrigger asChild>
        <Button variant="outline">{t.orders}</Button>
      </TooltipTrigger>
      <TooltipContent>{t.description}</TooltipContent>
    </Tooltip>
  );
}

/** Hover or focus the button. Tooltips never carry essential information (no hover on touch screens). */
export const Default: Story = { render: () => <Demo /> };
export const OpenByDefault: Story = { render: () => <Demo defaultOpen /> };
