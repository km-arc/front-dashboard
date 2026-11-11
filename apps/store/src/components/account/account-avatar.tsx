"use client";

import { UserIcon, cn } from "@front-dashboard/ui";
import type { SessionUser } from "../../features/auth/service";

/** A round badge with the first letter of the name, or a person icon when there is no name. Decorative. */
export function AccountAvatar({ user, className }: { user: SessionUser; className?: string }) {
  const initial = user.displayName ? Array.from(user.displayName.trim())[0] : undefined;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
        className,
      )}
    >
      {initial ?? <UserIcon className="size-4" />}
    </span>
  );
}
