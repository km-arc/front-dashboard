"use client";

import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useDirection } from "@radix-ui/react-direction";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type SVGProps,
} from "react";
import { cn } from "../../lib/utils";
import { CheckIcon } from "./icons";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuPortal = MenuPrimitive.Portal;
export const DropdownMenuSub = MenuPrimitive.Sub;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

// Points toward the reading end; flipped in RTL (see DropdownMenuSubTrigger).
function ChevronEndIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const itemBase =
  "relative flex min-h-11 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-base outline-none md:min-h-9 md:text-sm focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const panelBase =
  "z-50 min-w-32 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md";

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof MenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const dir = useDirection();
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={ref}
        dir={dir}
        sideOffset={sideOffset}
        className={cn(
          panelBase,
          "max-h-[var(--radix-dropdown-menu-content-available-height)]",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof MenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(itemBase, "[&>svg]:size-4 [&>svg]:shrink-0", inset && "ps-8", className)}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof MenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem ref={ref} className={cn(itemBase, "ps-8 pe-2", className)} {...props}>
    <span className="absolute start-2 flex size-4 items-center justify-center">
      <MenuPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </MenuPrimitive.ItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof MenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem ref={ref} className={cn(itemBase, "ps-8 pe-2", className)} {...props}>
    <span className="absolute start-2 flex size-4 items-center justify-center">
      <MenuPrimitive.ItemIndicator>
        <span className="block size-2 rounded-full bg-current" />
      </MenuPrimitive.ItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof MenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "ps-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof MenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/** Keyboard shortcut hint, pushed to the reading end. */
export function DropdownMenuShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("ms-auto text-xs tracking-widest opacity-70", className)} {...props} />
  );
}

export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof MenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <MenuPrimitive.SubTrigger
    ref={ref}
    className={cn(itemBase, "data-[state=open]:bg-accent", inset && "ps-8", className)}
    {...props}
  >
    {children}
    <ChevronEndIcon className="ms-auto size-4 rtl:rotate-180" />
  </MenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof MenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  const dir = useDirection();
  return (
    <MenuPrimitive.SubContent ref={ref} dir={dir} className={cn(panelBase, className)} {...props} />
  );
});
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";
