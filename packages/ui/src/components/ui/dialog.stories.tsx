import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocale } from "../../i18n/locale-provider";
import { useSampleText } from "../../storybook/sample-text";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ defaultOpen }: { defaultOpen?: boolean }) {
  const t = useSampleText();
  const { t: translate } = useLocale();
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button>{t.orders}</Button>
      </DialogTrigger>
      <DialogContent closeLabel={translate("common.close")}>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <p className="text-sm">{t.body}</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t.cancel}</Button>
          </DialogClose>
          <Button>{t.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = { render: () => <Demo /> };
/** Opens immediately so the layout can be reviewed in every mode, brand and direction. */
export const OpenByDefault: Story = { render: () => <Demo defaultOpen /> };
