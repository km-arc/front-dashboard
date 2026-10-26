import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/** Loading placeholder. Decorative: mark the loading region itself with `aria-busy` and a text/status. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted motion-reduce:animate-none", className)}
      {...props}
    />
  );
}
