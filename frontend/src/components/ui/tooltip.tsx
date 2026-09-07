"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/cn";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
 React.ComponentRef<typeof TooltipPrimitive.Content>,
 React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
 <TooltipPrimitive.Portal>
 <TooltipPrimitive.Content
 ref={ref}
 sideOffset={sideOffset}
 className={cn(
 "z-50 overflow-hidden rounded-md border border-secondary-200 bg-secondary-950 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 dark:border-secondary-800",
 className
 )}
 {...props}
 />
 </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
