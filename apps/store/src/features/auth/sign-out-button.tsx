"use client";

import { useTranslations } from "next-intl";
import { Button } from "@front-dashboard/ui";
import { signOutAction } from "./actions";

export function SignOutButton() {
  const t = useTranslations("dashboard");

  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline">
        {t("signOut")}
      </Button>
    </form>
  );
}
