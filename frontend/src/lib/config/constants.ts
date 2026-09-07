import { PlatformType, PLATFORM_CONFIG } from '../types/integration';

export const DEFAULT_CHART_COLORS = [
 '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
 '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4',
];

export const CHART_TYPES = {
 area: { label: 'Area', icon: 'AreaChart' },
 line: { label: 'Line', icon: 'LineChart' },
 bar: { label: 'Bar', icon: 'BarChart' },
 'horizontal-bar': { label: 'Horizontal Bar', icon: 'BarChart' },
 pie: { label: 'Pie', icon: 'PieChart' },
 funnel: { label: 'Funnel', icon: 'FunnelChart' },
} as const;

export const DATE_RANGES = [
 { value: 'last7', label: 'Last 7 Days' },
 { value: 'last30', label: 'Last 30 Days' },
 { value: 'last90', label: 'Last 90 Days' },
 { value: 'month', label: 'This Month' },
 { value: 'quarter', label: 'This Quarter' },
 { value: 'year', label: 'This Year' },
] as const;

export const REPORT_TYPES = [
 { value: 'monthly', label: 'Monthly' },
 { value: 'quarterly', label: 'Quarterly' },
 { value: 'annual', label: 'Annual' },
 { value: 'custom', label: 'Custom' },
] as const;

export const SCHEDULE_FREQUENCIES = [
 { value: 'daily', label: 'Daily' },
 { value: 'weekly', label: 'Weekly' },
 { value: 'monthly', label: 'Monthly' },
 { value: 'quarterly', label: 'Quarterly' },
] as const;

export const CURRENCIES = [
 { value: 'USD', label: 'USD ($)' },
 { value: 'EUR', label: 'EUR (€)' },
 { value: 'GBP', label: 'GBP (£)' },
 { value: 'INR', label: 'INR (₹)' },
];

export const TIMEZONES = [
 { value: 'UTC', label: 'UTC' },
 { value: 'America/New_York', label: 'Eastern Time (ET)' },
 { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
 { value: 'Europe/London', label: 'London (GMT)' },
 { value: 'Asia/Kolkata', label: 'India (IST)' },
 { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

export const PLAN_LIMITS = {
 starter: { clients: 5, reports: 20, integrations: 3, apiCalls: 10000, storage: 5 },
 pro: { clients: 25, reports: 100, integrations: 10, apiCalls: 100000, storage: 50 },
 enterprise: { clients: Infinity, reports: Infinity, integrations: Infinity, apiCalls: Infinity, storage: Infinity },
};

export const PLAN_PRICES = {
 starter: { monthly: 29, yearly: 290 },
 pro: { monthly: 99, yearly: 990 },
 enterprise: { monthly: 299, yearly: 2990 },
};

export const TEAM_ROLES = [
 { value: 'admin', label: 'Admin', description: 'Full access to all features' },
 { value: 'manager', label: 'Manager', description: 'Manage clients and reports' },
 { value: 'analyst', label: 'Analyst', description: 'View and create reports' },
] as const;

export const EMAIL_TEMPLATES = {
 report_delivery: {
 subject: 'Your {{reportType}} Report is Ready',
 template: 'Hi {{clientName}}, your {{reportType}} report for {{period}} is now available.',
 },
 } as const;

export const NAV_ITEMS = [
 { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
 { label: 'Clients', href: '/clients', icon: 'Users' },
 { label: 'Reports', href: '/reports', icon: 'FileText' },
 { label: 'Templates', href: '/templates', icon: 'LayoutTemplate' },
 { label: 'Integrations', href: '/clients', icon: 'Plug' },
 { label: 'Settings', href: '/settings', icon: 'Settings' },
 { label: 'Billing', href: '/billing', icon: 'CreditCard' },
] as const;
