"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const tabsListVariants = cva(
 "inline-flex h-10 items-center justify-center rounded-lg bg-secondary-100 p-1 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-400",
 {
 variants: {
 variant: {
 default: "",
 underline: "bg-transparent p-0 border-b border-secondary-200 dark:border-secondary-700",
 },
 },
 defaultVariants: { variant: "default" },
 }
);

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
 React.ComponentRef<typeof TabsPrimitive.List>,
 React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
 <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant, className }))} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
 React.ComponentRef<typeof TabsPrimitive.Trigger>,
 React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
 <TabsPrimitive.Trigger
 ref={ref}
 className={cn(
 "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-secondary-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-secondary-950 dark:data-[state=active]:text-secondary-50",
 variant === 'underline' && 'data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:rounded-none',
 className
 )}
 {...props}
 />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
 React.ComponentRef<typeof TabsPrimitive.Content>,
 React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
 <TabsPrimitive.Content
 ref={ref}
 className={cn("mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg", className)}
 {...props}
 />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
