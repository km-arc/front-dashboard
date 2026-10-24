import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useFormText } from "../../storybook/form-text";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Primitives/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function CountrySelect(props: ComponentProps<typeof Select>) {
  const t = useFormText();
  return (
    <Select {...props}>
      <SelectTrigger className="w-56" aria-label={t.country}>
        <SelectValue placeholder={t.choose} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t.asia}</SelectLabel>
          <SelectItem value="ir">{t.iran}</SelectItem>
          <SelectItem value="jp">{t.japan}</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>{t.europe}</SelectLabel>
          <SelectItem value="de">{t.germany}</SelectItem>
          <SelectItem value="fr">{t.france}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Default: Story = { render: () => <CountrySelect /> };
export const Preselected: Story = { render: () => <CountrySelect defaultValue="ir" /> };
export const Disabled: Story = { render: () => <CountrySelect disabled /> };
/** Opens the list so the popup placement and item alignment can be reviewed in RTL. */
export const OpenList: Story = { render: () => <CountrySelect defaultOpen /> };
