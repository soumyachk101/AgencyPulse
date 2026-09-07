import type { Config } from "tailwindcss";

const config: Config = {
 content: [
 "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
 "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
 "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
 "./src/**/*.{ts,tsx}",
 "./index.html",
 "./src/**/*.{html}",
 ],
 theme: {
 extend: {
 colors: {
 primary: {
 DEFAULT: '#8B5CF6',
 50: '#F5F3FF',
 100: '#EDE9FE',
 200: '#DDD6FE',
 300: '#C4B5FD',
 400: '#A78BFA',
 500: '#8B5CF6',
 600: '#7C3AED',
 700: '#6D28D9',
 800: '#5B21B6',
 900: '#4C1D95',
 },
 secondary: {
 DEFAULT: '#64748B',
 50: '#F8FAFC',
 100: '#F1F5F9',
 200: '#E2E8F0',
 300: '#CBD5E1',
 400: '#94A3B8',
 500: '#64748B',
 600: '#475569',
 700: '#334155',
 800: '#1E293B',
 900: '#0F172A',
 },
 success: '#10B981',
 warning: '#F59E0B',
 danger: '#EF4444',
 info: '#3B82F6',
 sidebar: {
 DEFAULT: '#FFFFFF',
 border: '#E2E8F0',
 foreground: '#1E293B',
 },
 },
 fontFamily: {
 sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
 branding: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
 mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
 },
 borderRadius: {
 lg: 'var(--radius)',
 md: 'calc(var(--radius) - 2px)',
 sm: 'calc(var(--radius) - 4px)',
 },
 animation: {
 'accordion-down': 'accordion-down 0.2s ease-out',
 'accordion-up': 'accordion-up 0.2s ease-out',
 'fade-in': 'fadeIn 0.3s ease-in-out',
 'slide-in': 'slideIn 0.3s ease-out',
 'pulse-sync': 'pulseSync 2s ease-in-out infinite',
 'spin-slow': 'spin 3s linear infinite',
 },
 keyframes: {
 'accordion-down': {
 from: { height: '0', opacity: '0' },
 to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
 },
 'accordion-up': {
 from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
 to: { height: '0', opacity: '0' },
 },
 fadeIn: {
 from: { opacity: '0', transform: 'translateY(10px)' },
 to: { opacity: '1', transform: 'translateY(0)' },
 },
 slideIn: {
 from: { transform: 'translateX(-100%)' },
 to: { transform: 'translateX(0)' },
 },
 pulseSync: {
 '0%, 100%': { opacity: '1', transform: 'scale(1)' },
 '50%': { opacity: '0.7', transform: 'scale(1.05)' },
 },
 },
 },
 darkMode: ['class'],
 },
};
export default config;
