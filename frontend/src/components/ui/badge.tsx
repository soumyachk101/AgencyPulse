"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
 "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
 {
 variants: {
 variant: {
 default:
 "border-transparent bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
 secondary:
 "border-transparent bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
 success:
 "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
 warning:
 "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
 danger:
 "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
 outline:
 "text-secondary-700 dark:text-secondary-300",
 },
 size: {
 default: "px-2.5 py-0.5 text-xs",
 sm: "px-2 py-0 text-[10px]",
 lg: "px-3 py-1 text-sm",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
 return (
 <div className={cn(badgeVariants({ variant, size, className }))} {...props} />
 );
}

const skeletonVariants = cva("animate-pulse rounded-md bg-secondary-200 dark:bg-secondary-800", {
 variants: {
 variant: {
 default: "",
 pulse: "animate-pulse",
 wave: "animate-[wave_1.5s_ease-in-out_infinite]",
 },
 },
 defaultVariants: {
 variant: "default",
 },
});

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
 return <div className={cn(skeletonVariants({ variant, className }))} {...props} />;
}

const switchVariants = cva(
 "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-600 data-[state=unchecked]:bg-secondary-300 dark:data-[state=unchecked]:bg-secondary-700 dark:focus-visible:ring-offset-secondary-950",
 {
 variants: {
 size: {
 default: "h-5 w-9",
 sm: "h-4 w-7",
 lg: "h-6 w-11",
 },
 },
 defaultVariants: {
 size: "default",
 },
 }
);

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof switchVariants> {
 checked?: boolean;
 onCheckedChange?: (checked: boolean) => void;
}

function Switch({ className, size, checked, onCheckedChange, ...props }: SwitchProps) {
 return (
 <button
 type="button"
 role="switch"
 aria-checked={checked}
 data-state={checked ? "checked" : "unchecked"}
 className={cn(switchVariants({ size, className }))}
 onClick={() => onCheckedChange?.(!checked)}
 {...props}
 >
 <span
 data-state={checked ? "checked" : "unchecked"}
 className={cn(
 "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:bg-secondary-950",
 size === 'sm' && 'h-3 w-3 data-[state=checked]:translate-x-3',
 size === 'lg' && 'h-5 w-5 data-[state=checked]:translate-x-5',
 )}
 />
 </button>
 );
}

const Accordion = AccordionPrimitive.Root;
const AccordionItem = AccordionPrimitive.Item;
const AccordionTrigger = React.forwardRef<
 React.ComponentRef<typeof AccordionPrimitive.Trigger>,
 React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
 <AccordionPrimitive.Header className="flex">
 <AccordionPrimitive.Trigger
 ref={ref}
 className={cn(
 "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
 className
 )}
 {...props}
 >
 {children}
 <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
 </AccordionPrimitive.Trigger>
 </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
 React.ComponentRef<typeof AccordionPrimitive.Content>,
 React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
 <AccordionPrimitive.Content
 ref={ref}
 className={cn(
 "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
 className
 )}
 {...props}
 >
 <div className="pb-4 pt-0">{children}</div>
 </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const Tabs = AccordionPrimitive.Root;
const TabsList = React.forwardRef<
 React.ComponentRef<typeof AccordionPrimitive.Trigger>,
 React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => (
 <AccordionPrimitive.Trigger
 ref={ref}
 className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-secondary-100 p-1 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-400", className)}
 {...props}
 />
));
TabsList.displayName = "TabsList";

const TabsTrigger = AccordionPrimitive.Trigger;
const TabsContent = AccordionPrimitive.Content;

const sliderVariants = cva(
 "relative flex w-full touch-none select-none items-center",
 {
 variants: {
 size: {
 default: "h-5",
 sm: "h-4",
 lg: "h-6",
 },
 },
 defaultVariants: { size: "default" },
 });

const Alert = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }
>(({ className, variant = 'default', ...props }, ref) => (
 <div
 ref={ref}
 role="alert"
 className={cn(
 "relative w-full rounded-lg border p-4",
 variant === 'default' && "border-secondary-200 bg-white text-secondary-950 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-50",
 variant === 'destructive' && "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
 className
 )}
 {...props}
 />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
 HTMLParagraphElement,
 React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
 <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
 HTMLParagraphElement,
 React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
 <div className={cn("text-sm opacity-90", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

const Separator = React.forwardRef<
 React.ComponentRef<typeof AccordionPrimitive.Separator>,
 React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Separator>
>(({ className, orientation = "horizontal", ...props }, ref) => (
 <AccordionPrimitive.Separator
 ref={ref}
 decorative
 orientation={orientation}
 className={cn(
 "shrink-0 bg-secondary-200 dark:bg-secondary-800",
 orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
 className
 )}
 {...props}
 />
));
Separator.displayName = "Separator";

const ScrollArea = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
 <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
 <div className="h-full w-full rounded-[inherit] overflow-y-auto overflow-x-hidden">
 {children}
 </div>
 </div>
));
ScrollArea.displayName = "ScrollArea";

const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export {
 Badge,
 badgeVariants,
 Skeleton,
 skeletonVariants,
 Switch,
 switchVariants,
 Accordion,
 AccordionItem,
 AccordionTrigger,
 AccordionContent,
 Tabs,
 TabsList,
 TabsTrigger,
 TabsContent,
 Alert,
 AlertTitle,
 AlertDescription,
 Separator,
 ScrollArea,
 ToastProvider,
};
