import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CartIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  GridIcon,
  HomeIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "./icons";

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
  { name: "MenuIcon", Icon: MenuIcon },
  { name: "CloseIcon", Icon: CloseIcon },
  { name: "SearchIcon", Icon: SearchIcon },
  { name: "CartIcon", Icon: CartIcon },
  { name: "UserIcon", Icon: UserIcon },
  { name: "SunIcon", Icon: SunIcon },
  { name: "MoonIcon", Icon: MoonIcon },
  { name: "HomeIcon", Icon: HomeIcon },
  { name: "GridIcon", Icon: GridIcon },
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
