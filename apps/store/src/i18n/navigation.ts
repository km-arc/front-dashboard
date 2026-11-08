import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware Link, redirect and router hooks; paths are written without the locale prefix. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
