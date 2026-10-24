import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const LTR_TYPES = new Set(["email", "tel", "url", "number"]);
const LTR_INPUT_MODES = new Set(["email", "tel", "url", "numeric", "decimal"]);

/**
 * Emails, phone numbers, URLs and numbers read LTR even on RTL pages. Returns "ltr" for those,
 * otherwise undefined so the input inherits the page direction.
 */
export function getInputDir(type?: string, inputMode?: string): "ltr" | undefined {
  if (type && LTR_TYPES.has(type)) return "ltr";
  if (inputMode && LTR_INPUT_MODES.has(inputMode)) return "ltr";
  return undefined;
}

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputMode, dir, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      inputMode={inputMode}
      dir={dir ?? getInputDir(type, inputMode)}
      className={cn(
        // Mobile-first: 44px target and 16px text (prevents iOS zoom); compact from `md`.
        "flex min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background md:text-sm",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        // LTR content inside an RTL page: keep the (Persian) placeholder on the reading side.
        "[[dir=rtl]_&[dir=ltr]]:placeholder-shown:text-end",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
