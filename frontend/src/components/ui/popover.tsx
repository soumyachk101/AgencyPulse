"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import * as PopoverPrimitive from "@radix-ui/react-popover";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
 React.ComponentRef<typeof PopoverPrimitive.Content>,
 React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
 <PopoverPrimitive.Portal>
 <PopoverPrimitive.Content
 ref={ref}
 align={align}
 sideOffset={sideOffset}
 className={cn(
 "z-50 w-72 rounded-lg border border-secondary-200 bg-white p-4 text-secondary-950 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-50",
 className
 )}
 {...props}
 />
 </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverArrow = React.forwardRef<
 React.ComponentRef<typeof PopoverPrimitive.Arrow>,
 React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
 <PopoverPrimitive.Arrow ref={ref} className={cn("fill-secondary-200 dark:fill-secondary-800", className)} {...props} />
));
PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverArrow };
