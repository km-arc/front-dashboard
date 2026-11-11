import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CartIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronEndIcon,
  ChevronUpIcon,
  CloseIcon,
  GridIcon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  PackageIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
  WalletIcon,
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
  { name: "PackageIcon", Icon: PackageIcon },
  { name: "MapPinIcon", Icon: MapPinIcon },
  { name: "WalletIcon", Icon: WalletIcon },
  { name: "LifeBuoyIcon", Icon: LifeBuoyIcon },
  { name: "ChevronEndIcon", Icon: ChevronEndIcon },
  { name: "LogOutIcon", Icon: LogOutIcon },
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
