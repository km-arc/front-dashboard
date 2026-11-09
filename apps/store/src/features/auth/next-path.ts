/**
 * Where to go after signing in. Only a path on this site is accepted (starts with a single "/", no scheme, no
 * backslash), so a crafted `?next=` link cannot send someone to another site.
 */
export function safeNextPath(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || value.includes("://")) return fallback;
  return value;
}
