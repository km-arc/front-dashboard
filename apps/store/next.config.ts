import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl finds ./src/i18n/request.ts on its own.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @front-dashboard/ui ships TypeScript source (see its package.json "exports").
  transpilePackages: ["@front-dashboard/ui"],
};

export default withNextIntl(nextConfig);
