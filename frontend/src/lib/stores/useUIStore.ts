import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
 sidebarCollapsed: boolean;
 searchOpen: boolean;
 mobileNavOpen: boolean;
 theme: 'light' | 'dark' | 'system';
 toasts: Array<{ id: string; title: string; description?: string; variant: 'default' | 'destructive' | 'success' }>;
 toggleSidebar: () => void;
 setSidebarCollapsed: (collapsed: boolean) => void;
 setSearchOpen: (open: boolean) => void;
 setMobileNavOpen: (open: boolean) => void;
 setTheme: (theme: 'light' | 'dark' | 'system') => void;
 addToast: (toast: { title: string; description?: string; variant?: 'default' | 'destructive' | 'success' }) => void;
 removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
 persist(
 (set) => ({
 sidebarCollapsed: false,
 searchOpen: false,
 mobileNavOpen: false,
 theme: 'system',
 toasts: [],
 toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
 setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
 setSearchOpen: (searchOpen) => set({ searchOpen }),
 setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
 setTheme: (theme) => set({ theme }),
 addToast: (toast) =>
 set((state) => ({
 toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
 })),
 removeToast: (id) =>
 set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
 }),
 { name: 'ui-storage' }
 )
);
