import { defineRouting } from "next-intl/routing";
import { LOCALES } from "@front-dashboard/ui/locales";
import { env } from "../env";

/** Every URL carries its locale (/en, /fa). `/` is redirected using the cookie, then Accept-Language, then the default. */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: env.defaultLocale,
  localePrefix: "always",
});
