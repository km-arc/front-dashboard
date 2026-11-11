"use client";

import type { SessionUser } from "../../features/auth/service";
import { AccountAvatar } from "./account-avatar";

/** Who is signed in: the avatar, the name and the mobile number (always read left to right). */
export function ProfileCard({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <AccountAvatar user={user} className="size-12 text-lg" />
      <div className="min-w-0">
        <p className="truncate font-semibold">{user.displayName ?? user.mobile}</p>
        {user.displayName ? (
          <p dir="ltr" className="truncate text-start text-sm text-muted-foreground">
            {user.mobile}
          </p>
        ) : null}
      </div>
    </div>
  );
}
