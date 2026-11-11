"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LogOutIcon,
} from "@front-dashboard/ui";
import { signOutAction } from "../../features/auth/actions";
import { useSessionState } from "../../features/auth/session-context";
import { accountNav } from "../../config/navigation";
import { Link } from "../../i18n/navigation";
import { ACCOUNT_ICONS } from "../account/account-icons";
import { AccountAvatar } from "../account/account-avatar";

/** The header's account control: a Sign in button when signed out, an avatar menu when signed in. */
export function AccountMenu() {
  const t = useTranslations("account");
  const shell = useTranslations("shell");
  const login = useTranslations("login");
  const dashboard = useTranslations("dashboard");
  const state = useSessionState();
  const [pending, startTransition] = useTransition();

  if (state.status === "loading") {
    return <div aria-hidden="true" className="size-9 animate-pulse rounded-full bg-muted" />;
  }

  if (state.status === "signed-out") {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">{login("signIn")}</Link>
      </Button>
    );
  }

  const { user } = state;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label={t("menu")}>
          <AccountAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="space-y-0.5">
          <span className="block truncate text-sm font-semibold">
            {user.displayName ?? user.mobile}
          </span>
          {user.displayName ? (
            <span dir="ltr" className="block text-start text-xs font-normal text-muted-foreground">
              {user.mobile}
            </span>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountNav.map((item) => {
          const Icon = ACCOUNT_ICONS[item.id];
          const label = t(`nav.${item.id}`);
          return item.available ? (
            <DropdownMenuItem key={item.id} asChild>
              <Link href={item.href}>
                <Icon />
                {label}
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={item.id} disabled>
              <Icon />
              <span className="flex-1">{label}</span>
              <span className="text-xs">{shell("soon")}</span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          onSelect={() => {
            startTransition(async () => {
              await signOutAction();
            });
          }}
        >
          <LogOutIcon />
          {dashboard("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
