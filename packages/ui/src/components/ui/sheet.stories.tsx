import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocale } from "../../i18n/locale-provider";
import { useSampleText } from "../../storybook/sample-text";
import { Button } from "./button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from "./sheet";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

type Side = NonNullable<SheetContentProps["side"]>;
// Cast on purpose: the story should still compile if a side is renamed (the checklist verifies each side).
const side = (value: string) => value as Side;

function Demo({ placement, defaultOpen }: { placement: Side; defaultOpen?: boolean }) {
  const t = useSampleText();
  const { t: translate } = useLocale();
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button>{t.orders}</Button>
      </SheetTrigger>
      <SheetContent side={placement} closeLabel={translate("common.close")}>
        <SheetHeader>
          <SheetTitle>{t.title}</SheetTitle>
          <SheetDescription>{t.description}</SheetDescription>
        </SheetHeader>
        <p className="text-sm">{t.body}</p>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t.cancel}</Button>
          </SheetClose>
          <Button>{t.save}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** `start` is the left edge in LTR and the right edge in RTL; `end` is the opposite. */
export const Start: Story = { render: () => <Demo placement={side("start")} /> };
export const End: Story = { render: () => <Demo placement={side("end")} /> };
export const Top: Story = { render: () => <Demo placement={side("top")} /> };
export const Bottom: Story = { render: () => <Demo placement={side("bottom")} /> };
export const EndOpenByDefault: Story = {
  render: () => <Demo placement={side("end")} defaultOpen />,
};
