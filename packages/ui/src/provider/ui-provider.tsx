"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import type { ReactNode } from "react";

export type UiDirection = "ltr" | "rtl";

export interface UiProviderProps {
  /** Text direction, derived by the host app from the active locale. */
  dir: UiDirection;
  children: ReactNode;
}

/**
 * Composition point for the design system. Gives Radix primitives the correct
 * direction. Theme (mode x brand) and i18n keep their own providers (steps 1.1, 1.2).
 */
export function UiProvider({ dir, children }: UiProviderProps) {
  return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}
