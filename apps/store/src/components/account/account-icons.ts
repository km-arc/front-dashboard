import type { ComponentType, SVGProps } from "react";
import {
  GridIcon,
  LifeBuoyIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
  WalletIcon,
} from "@front-dashboard/ui";
import type { AccountNavId } from "../../config/navigation";

export const ACCOUNT_ICONS: Record<AccountNavId, ComponentType<SVGProps<SVGSVGElement>>> = {
  overview: GridIcon,
  orders: PackageIcon,
  profile: UserIcon,
  addresses: MapPinIcon,
  wallet: WalletIcon,
  support: LifeBuoyIcon,
};
