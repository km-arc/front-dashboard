"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { AccordionMultipleProps, AccordionSingleProps } from "@radix-ui/react-accordion";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "./icons";

export type AccordionProps =
  | (Omit<AccordionSingleProps, "type"> & { type?: "single" })
  | (Omit<AccordionMultipleProps, "type"> & { type: "multiple" });

/**
 * Default: `type="single"` with `collapsible` (one section open at a time, and it can be closed again).
 * Pass `type="multiple"` to allow several open sections, or `collapsible={false}` to keep one always open.
 */
export const Accordion = forwardRef<ElementRef<typeof AccordionPrimitive.Root>, AccordionProps>(
  ({ type = "single", ...props }, ref) =>
    type === "multiple" ? (
      <AccordionPrimitive.Root
        ref={ref}
        type="multiple"
        {...(props as Omit<AccordionMultipleProps, "type">)}
      />
    ) : (
      <AccordionPrimitive.Root
        ref={ref}
        type="single"
        collapsible
        {...(props as Omit<AccordionSingleProps, "type">)}
      />
    ),
);
Accordion.displayName = "Accordion";

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

/** The trigger sits inside a heading (h3 by default), so sections are navigable by heading. */
export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex min-h-11 flex-1 items-center justify-between gap-4 py-3 text-start text-base font-medium transition-colors md:text-sm",
        "hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm" {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";
