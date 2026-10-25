"use client";

import { useDirection } from "@radix-ui/react-direction";
import type { CSSProperties } from "react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

export { toast };
export type { ToasterProps };

/**
 * Mount once near the root of the app, inside UiProvider, then call `toast("Saved")` from anywhere.
 * - Colors come from the design tokens, so light, dark and brand themes just work.
 * - Direction comes from UiProvider. Default position is bottom-center (best on phones).
 * - `theme` only affects sonner's own icons/close button: pass `theme={resolvedMode}` from `useTheme()`.
 */
export function Toaster({ style, ...props }: ToasterProps) {
  const dir = useDirection();
  const tokens = {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
  } as CSSProperties;

  return (
    <Sonner
      dir={dir}
      position="bottom-center"
      theme="system"
      closeButton
      style={{ ...tokens, ...style }}
      {...props}
    />
  );
}
