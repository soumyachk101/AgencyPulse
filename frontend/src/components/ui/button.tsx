"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
 {
 variants: {
 variant: {
 default: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
 destructive: "bg-danger text-white hover:bg-red-600 shadow-sm",
 outline: "border border-secondary-300 bg-transparent hover:bg-secondary-100 text-secondary-700 dark:border-secondary-600 dark:hover:bg-secondary-800 dark:text-secondary-200",
 secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700",
 ghost: "hover:bg-secondary-100 text-secondary-700 dark:hover:bg-secondary-800 dark:text-secondary-200",
 link: "text-primary-600 underline-offset-4 hover:underline dark:text-primary-400",
 },
 size: {
 default: "h-10 px-4 py-2",
 sm: "h-8 rounded-md px-3 text-xs",
 lg: "h-12 rounded-lg px-8 text-base",
 icon: "h-10 w-10",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 }
);

interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 VariantProps<typeof buttonVariants> {
 asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, asChild = false, ...props }, ref) => {
 const Comp = asChild ? Slot : "button";
 return (
 <Comp
 className={cn(buttonVariants({ variant, size, className }))}
 ref={ref}
 {...props}
 />
 );
 }
);
Button.displayName = "Button";

export { Button, buttonVariants };
