"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Textarea = React.forwardRef<
 HTMLTextAreaElement,
 React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
 return (
 <textarea
 className={cn(
 "flex min-h-20 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-secondary-700 dark:bg-secondary-950 dark:ring-offset-secondary-950 dark:placeholder:text-secondary-400 dark:focus-visible:ring-primary-400",
 className
 )}
 ref={ref}
 {...props}
 />
 );
});
Textarea.displayName = "Textarea";

export { Textarea };
