import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/**
 * The status color is a stripe on the reading-start edge; text keeps the normal foreground, so contrast
 * is guaranteed in every theme (some status colors are not readable as text on the page background).
 */
export const alertVariants = cva(
  "relative w-full rounded-md border border-s-4 bg-card p-4 text-sm text-card-foreground",
  {
    variants: {
      variant: {
        default: "",
        info: "border-s-info",
        success: "border-s-success",
        warning: "border-s-warning",
        destructive: "border-s-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

/** Errors and warnings are announced assertively (`alert`); everything else politely (`status`). */
export function getAlertRole(variant?: AlertProps["variant"]): "alert" | "status" {
  return variant === "destructive" || variant === "warning" ? "alert" : "status";
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, role, ...props }, ref) => (
    <div
      ref={ref}
      role={role ?? getAlertRole(variant)}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

export const AlertTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-1 font-medium leading-none", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-muted-foreground", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";
