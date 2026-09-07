import { create } from 'zustand';

interface ThemeState {
 theme: 'light' | 'dark' | 'system';
 resolvedTheme: 'light' | 'dark';
 setTheme: (theme: 'light' | 'dark' | 'system') => void;
 toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
 theme: 'system',
 resolvedTheme: 'light',
 setTheme: (theme) => {
 set({ theme });
 updateResolvedTheme(theme);
 },
 toggleTheme: () => {
 const current = get().theme;
 if (current === 'light') {
 set({ theme: 'dark' });
 updateResolvedTheme('dark');
 } else if (current === 'dark') {
 set({ theme: 'system' });
 updateResolvedTheme('system');
 } else {
 set({ theme: 'light' });
 updateResolvedTheme('light');
 }
 },
}));

function updateResolvedTheme(theme: 'light' | 'dark' | 'system') {
 const resolved = theme === 'system'
 ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
 : theme;
 document.documentElement.classList.remove('light', 'dark');
 document.documentElement.classList.add(resolved);
 useThemeStore.setState({ resolvedTheme: resolved });
}
