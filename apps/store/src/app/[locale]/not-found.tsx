import { getTranslations } from "next-intl/server";
import { Link } from "../../i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main id="main" className="mx-auto w-full max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {t("home")}
      </Link>
    </main>
  );
}
