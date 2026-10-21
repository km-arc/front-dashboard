import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { cn } from "../../lib/utils";

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      // `after:` stretches the hit area to 44px high.
      "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ring-offset-background after:absolute after:-inset-y-2.5 after:inset-x-0",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      // Logical margin (not translate-x) so the thumb moves toward the correct side in RTL automatically.
      className="pointer-events-none block size-5 rounded-full bg-background shadow-sm transition-[margin] data-[state=checked]:ms-5 data-[state=unchecked]:ms-0"
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
