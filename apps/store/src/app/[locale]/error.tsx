"use client";

import { useEffect } from "react";
import { Alert, AlertTitle, Button, useLocale } from "@front-dashboard/ui";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-6">
      <Alert variant="destructive">
        <AlertTitle>{t("common.error")}</AlertTitle>
      </Alert>
      <Button onClick={reset}>{t("common.retry")}</Button>
    </div>
  );
}
