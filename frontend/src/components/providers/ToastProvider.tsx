"use client";

import { useUIStore } from "@/lib/stores/useUIStore";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
 const { toasts, removeToast } = useUIStore();

 return (
 <>
 {children}
 <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
 <AnimatePresence>
 {toasts.map((toast) => (
 <motion.div
 key={toast.id}
 initial={{ opacity: 0, y: 20, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, x: 20, scale: 0.95 }}
 transition={{ duration: 0.2 }}
 className={cn(
 "flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur",
 toast.variant === 'destructive' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
 toast.variant === 'success' && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
 toast.variant === 'default' && "border-secondary-200 bg-white dark:border-secondary-800 dark:bg-secondary-950"
 )}
 >
 <div className="flex-shrink-0 mt-0.5">
 {toast.variant === 'destructive' && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
 {toast.variant === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />}
 {(!toast.variant || toast.variant === 'default') && <Info className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
 </div>
 <div className="flex-1 space-y-1">
 <p className="text-sm font-medium text-secondary-950 dark:text-secondary-50">
 {toast.title}
 </p>
 {toast.description && (
 <p className="text-sm text-secondary-600 dark:text-secondary-400">
 {toast.description}
 </p>
 )}
 </div>
 <button
 onClick={() => removeToast(toast.id)}
 className="flex-shrink-0 rounded p-1 hover:bg-secondary-200 dark:hover:bg-secondary-800 transition-colors"
 >
 <X className="h-4 w-4" />
 </button>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </>
 );
}
