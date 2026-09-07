"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { Textarea } from "@radix-ui/react-textarea";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

function Label({ className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
 return <LabelPrimitive.Root className={cn(labelVariants(), className)} {...props} />;
}

const inputVariants = cva(
 "flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm ring-offset-white transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-secondary-700 dark:bg-secondary-950 dark:ring-offset-secondary-950 dark:placeholder:text-secondary-400 dark:focus-visible:ring-primary-400",
 {
 variants: {
 variant: {
 default: "",
 error: "border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400",
 },
 size: {
 default: "h-10 px-3 py-2",
 sm: "h-8 rounded-md px-2 text-xs",
 lg: "h-12 rounded-lg px-4 text-base",
 },
 },
 defaultVariants: { variant: "default", size: "default" },
 }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

function Input({ className, variant, size, type, ...props }: InputProps) {
 return (
 <input type={type} className={cn(inputVariants({ variant, size, className }))} {...props} />
 );
}

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
 variants: {
 size: {
 default: "h-10 w-10",
 sm: "h-8 w-8",
 lg: "h-12 w-12",
 xl: "h-16 w-16",
 },
 },
 defaultVariants: { size: "default" },
 });

const Avatar = React.forwardRef<
 React.ComponentRef<typeof AvatarPrimitive.Root>,
 React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
 <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size, className }))} {...props} />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
 React.ComponentRef<typeof AvatarPrimitive.Image>,
 React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
 <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
 React.ComponentRef<typeof AvatarPrimitive.Fallback>,
 React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
 <AvatarPrimitive.Fallback
 ref={ref}
 className={cn("flex h-full w-full items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300", className)}
 {...props}
 />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
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
 "z-50 w-72 rounded-md border border-secondary-200 bg-white p-4 text-secondary-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-50",
 className
 )}
 {...props}
 />
 </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const ScrollArea = React.forwardRef<
 React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
 React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
 <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
 <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
 <ScrollAreaBar orientation="vertical" />
 <ScrollAreaBar orientation="horizontal" />
 </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollAreaBar = React.forwardRef<
 React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
 React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & { orientation?: "vertical" | "horizontal" }
>(({ className, orientation = "vertical", ...props }, ref) => (
 <ScrollAreaPrimitive.ScrollAreaScrollbar
 ref={ref}
 orientation={orientation}
 className={cn(
 "flex touch-none select-none p-[1px]",
 orientation === "vertical" && "h-full w-2 border-l border-l-transparent",
 orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent",
 className
 )}
 {...props}
 >
 <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-secondary-300 dark:bg-secondary-700" />
 </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollAreaBar.displayName = "ScrollAreaBar";

export {
 Label,
 Input,
 inputVariants,
 Avatar,
 AvatarImage,
 AvatarFallback,
 avatarVariants,
 Popover,
 PopoverTrigger,
 PopoverContent,
 ScrollArea,
 ScrollAreaBar,
};
