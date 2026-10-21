"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { applyBrand, clearBrand, validateBrand, type BrandDefinition } from "./brand";

export interface BrandContextValue {
  /** The validated, active brand, or null when the default theme is in use. */
  brand: BrandDefinition | null;
}

export interface BrandProviderProps {
  /** Brand fetched by the app from the backend. null/undefined = default light-blue theme. */
  brand?: BrandDefinition | null;
  /** Called (in an effect) when the brand fails validation; the default theme stays active. */
  onInvalid?: (issues: string[]) => void;
  children: ReactNode;
}

const BrandContext = createContext<BrandContextValue>({ brand: null });

/** Validates the brand and applies it to the document. Invalid brands never reach the DOM. */
export function BrandProvider({ brand, onInvalid, children }: BrandProviderProps) {
  const serialized = brand ? JSON.stringify(brand) : "";

  const result = useMemo(
    () => (serialized ? validateBrand(JSON.parse(serialized)) : null),
    [serialized],
  );
  const active = result?.ok ? result.brand : null;

  useEffect(() => {
    if (!result) {
      clearBrand();
      return;
    }
    if (!result.ok) {
      onInvalid?.(result.issues);
      clearBrand();
      return;
    }
    applyBrand(result.brand);
    return () => clearBrand();
    // `onInvalid` is intentionally not a dependency: a new callback identity must not re-apply the brand.
  }, [result]);

  const value = useMemo(() => ({ brand: active }), [active]);
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextValue {
  return useContext(BrandContext);
}
