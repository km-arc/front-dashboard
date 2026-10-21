import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useDirection } from "@radix-ui/react-direction";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { OVERLAY_SCRIM, OverlayCloseButton } from "./overlay-parts";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export const SheetOverlay = forwardRef<
  ElementRef<typeof SheetPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay ref={ref} className={cn(OVERLAY_SCRIM, className)} {...props} />
));
SheetOverlay.displayName = "SheetOverlay";

/**
 * `start` / `end` are logical edges: they are left/right in LTR and right/left in RTL, so a navigation
 * drawer opens from the reading-start edge in both languages.
 */
export const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-background p-6 text-foreground shadow-lg",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 max-h-[85dvh] overflow-y-auto border-b",
        bottom: "inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto border-t",
        start: "inset-y-0 start-0 h-full w-3/4 max-w-sm overflow-y-auto border-e",
        end: "inset-y-0 end-0 h-full w-3/4 max-w-sm overflow-y-auto border-s",
      },
    },
    defaultVariants: { side: "end" },
  },
);

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Accessible name of the close button. Pass the translated text (e.g. `t("common.close")`). */
  closeLabel?: string;
  hideClose?: boolean;
}

export const SheetContent = forwardRef<ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "end", className, children, closeLabel = "Close", hideClose = false, ...props }, ref) => {
    const dir = useDirection();
    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          ref={ref}
          dir={dir}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          {children}
          {hideClose ? null : <OverlayCloseButton label={closeLabel} />}
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  },
);
SheetContent.displayName = "SheetContent";

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-start", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export const SheetTitle = forwardRef<
  ElementRef<typeof SheetPrimitive.Title>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("pe-8 text-lg font-semibold leading-tight", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = forwardRef<
  ElementRef<typeof SheetPrimitive.Description>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";
