import { z } from "zod";
import { DEFAULT_LOCALE, LOCALES } from "@front-dashboard/ui/locales";

/** Empty values in `.env` files (`NAME=`) count as "not set". */
const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

const schema = z.object({
  defaultLocale: z.preprocess(blankToUndefined, z.enum(LOCALES).default(DEFAULT_LOCALE)),
  timeZone: z.preprocess(
    blankToUndefined,
    z.string().refine(isTimeZone, "Unknown IANA time zone").default("Asia/Tehran"),
  ),
});

export type Env = z.infer<typeof schema>;

export interface RawEnv {
  defaultLocale?: string | undefined;
  timeZone?: string | undefined;
}

/** Validates the raw values and fails fast with one readable message. */
export function parseEnv(raw: RawEnv): Env {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }
  return result.data;
}

// NEXT_PUBLIC_* must be read as literal `process.env.NAME` so Next can inline them.
export const env: Env = parseEnv({
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  timeZone: process.env.NEXT_PUBLIC_TIME_ZONE,
});
