// Server-safe entry (`@front-dashboard/ui/theme-ssr`): pure functions only, no React and no client modules,
// so layouts and server components can build the first paint without loading the component library.
export { getThemeInitScript, type ThemeInitScriptOptions } from "./mode";
export { getBrandSsr } from "./brand-ssr";
export { BRAND_STYLE_ID, validateBrand, type BrandDefinition } from "./brand";
