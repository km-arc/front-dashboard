import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useSampleText } from "../../storybook/sample-text";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "Overlays/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ defaultOpen }: { defaultOpen?: boolean }) {
  const t = useSampleText();
  const [notify, setNotify] = useState(true);
  const [sort, setSort] = useState("new");
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{t.orders}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {t.save}
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>{t.cancel}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={notify} onCheckedChange={setNotify}>
          {t.notify}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="new">{t.fresh}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="failed">{t.failed}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{t.footer}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>{t.name}</DropdownMenuItem>
            <DropdownMenuItem>{t.remove}</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Default: Story = { render: () => <Demo /> };
/** Opens immediately to review alignment, item indicators and the sub-menu arrow in RTL. */
export const OpenByDefault: Story = { render: () => <Demo defaultOpen /> };
