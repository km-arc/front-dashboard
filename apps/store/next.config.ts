import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl finds ./src/i18n/request.ts on its own.
const withNextIntl = createNextIntlPlugin();

// Dev only: Next blocks dev resources (HMR, client scripts) for hosts other than localhost, so a phone or another
// computer on the network gets a page that never becomes interactive. List those hosts, comma separated.
const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins,
  // @front-dashboard/ui ships TypeScript source (see its package.json "exports").
  transpilePackages: ["@front-dashboard/ui"],
};

export default withNextIntl(nextConfig);
