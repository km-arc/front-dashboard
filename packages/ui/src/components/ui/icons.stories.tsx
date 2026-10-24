import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MinusIcon } from "./icons";

const meta = {
  title: "Primitives/Icons",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const icons = [
  { name: "CheckIcon", Icon: CheckIcon },
  { name: "MinusIcon", Icon: MinusIcon },
  { name: "ChevronDownIcon", Icon: ChevronDownIcon },
  { name: "ChevronUpIcon", Icon: ChevronUpIcon },
];

export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 text-foreground">
      {icons.map(({ name, Icon }) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon className="size-6" aria-hidden="true" />
          <span className="text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  ),
};
