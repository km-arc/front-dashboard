"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useDirection } from "@radix-ui/react-direction";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { cn } from "../../lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltips are hover/focus hints and do not exist on touch screens: never put essential information
 * only in a tooltip. `Tooltip` includes its own provider, so it works without an app-level
 * TooltipProvider (add one to share the open delay between tooltips).
 */
export function Tooltip({
  delayDuration = 300,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delayDuration} {...props} />
    </TooltipPrimitive.Provider>
  );
}

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const dir = useDirection();
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        dir={dir}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-xs rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = "TooltipContent";
