"use client";

import { useTranslations } from "next-intl";
import { Button, LogOutIcon } from "@front-dashboard/ui";
import { signOutAction } from "./actions";

export function SignOutButton({ className }: { className?: string }) {
  const t = useTranslations("dashboard");

  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" className={className}>
        <LogOutIcon />
        {t("signOut")}
      </Button>
    </form>
  );
}
