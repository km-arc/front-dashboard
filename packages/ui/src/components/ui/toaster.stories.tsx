import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSampleText } from "../../storybook/sample-text";
import { useTheme } from "../../theme/theme-provider";
import { Button } from "./button";
import { Toaster, toast } from "./toaster";

const meta = {
  title: "Overlays/Toaster",
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const t = useSampleText();
  const { resolvedMode } = useTheme();
  return (
    <>
      <Toaster theme={resolvedMode} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast(t.title, { description: t.description })}>{t.fresh}</Button>
        <Button variant="outline" onClick={() => toast.success(t.save)}>
          {t.save}
        </Button>
        <Button variant="destructive" onClick={() => toast.error(t.failed)}>
          {t.failed}
        </Button>
      </div>
    </>
  );
}

/** Click a button: the toast appears at the bottom center, with its close button on the end side. */
export const Default: Story = { render: () => <Demo /> };
