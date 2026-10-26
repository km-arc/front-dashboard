import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { SVGProps } from "react";

// Shared by Dialog and Sheet (both are Radix Dialog). Internal: not exported from the package.

/** Scrim behind overlays. Uses the page background (not black) so it suits light, dark and brand themes. */
export const OVERLAY_SCRIM = "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm";

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/** Close button in the top corner on the reading-end side (flips automatically in RTL). */
export function OverlayCloseButton({ label }: { label: string }) {
  return (
    <DialogPrimitive.Close className="absolute end-4 top-4 inline-flex size-8 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity after:absolute after:-inset-1.5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
      <CloseIcon />
      <span className="sr-only">{label}</span>
    </DialogPrimitive.Close>
  );
}
