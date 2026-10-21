import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useDirection } from "@radix-ui/react-direction";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { OVERLAY_SCRIM, OverlayCloseButton } from "./overlay-parts";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn(OVERLAY_SCRIM, className)} {...props} />
));
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Accessible name of the close button. Pass the translated text (e.g. `t("common.close")`). */
  closeLabel?: string;
  hideClose?: boolean;
}

/**
 * Always render a DialogTitle (and a DialogDescription, or set `aria-describedby={undefined}`).
 * The content is centered by a scrollable overlay, so tall dialogs scroll on small screens and
 * centering needs no direction-dependent translate.
 */
export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, closeLabel = "Close", hideClose = false, ...props }, ref) => {
  const dir = useDirection();
  return (
    <DialogPortal>
      <DialogOverlay dir={dir} className="grid place-items-center overflow-y-auto p-4">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "relative grid w-full max-w-lg gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg",
            className,
          )}
          {...props}
        >
          {children}
          {hideClose ? null : <OverlayCloseButton label={closeLabel} />}
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-start", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("pe-8 text-lg font-semibold leading-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
