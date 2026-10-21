declare module "jest-axe" {
  export function axe(
    html: Element | string,
    options?: unknown,
  ): Promise<{ violations: unknown[] }>;
}
