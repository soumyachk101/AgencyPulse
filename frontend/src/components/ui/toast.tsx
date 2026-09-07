"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import * as ToastPrimitive from "@radix-ui/react-toast";

const toastVariants = cva(
 "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
 {
 variants: {
 variant: {
 default: "border-secondary-200 bg-white text-secondary-950 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-50",
 destructive:
 "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
 success:
 "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
 },
 },
 defaultVariants: { variant: "default" },
 }
);

interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
 title?: string;
 description?: string;
}

const Toast = ({ className, variant, title, description, ...props }: ToastProps) => {
 return (
 <ToastPrimitive.Root className={cn(toastVariants({ variant, className }))} {...props}>
 {title && <div className="text-sm font-semibold">{title}</div>}
 {description && <div className="text-sm opacity-90">{description}</div>}
 </ToastPrimitive.Root>
 );
};

const ToastViewport = ToastPrimitive.Viewport;
const ToastClose = ToastPrimitive.Close;

function useToast() {
 const [toasts, setToasts] = React.useState<ToastProps[]>([]);
 const toast = React.useCallback((props: ToastProps & { id?: string }) => {
 const id = props.id || Math.random().toString();
 setToasts((t) => [...t, { ...props, id }]);
 setTimeout(() => setToasts((t) => t.filter((toast) => toast.id !== id)), 4000);
 return id;
 }, []);
 const removeToast = React.useCallback((id: string) => {
 setToasts((t) => t.filter((toast) => toast.id !== id));
 }, []);
 return { toast, toasts, removeToast };
}

export { Toast, ToastViewport, ToastClose, useToast, toastVariants };
