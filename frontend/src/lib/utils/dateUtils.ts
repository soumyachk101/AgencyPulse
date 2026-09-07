import { format, formatDistanceToNow, isAfter, isBefore, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, subDays, addDays, differenceInDays } from 'date-fns';

export const dateUtils = {
 format,
 formatDistanceToNow,
 isAfter,
 isBefore,
 startOfMonth,
 endOfMonth,
 startOfQuarter,
 endOfQuarter,
 subDays,
 addDays,
 differenceInDays,

 formatCurrency(value: number, currency = 'USD'): string {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency,
 }).format(value);
 },

 formatNumber(value: number, decimals = 0): string {
 return new Intl.NumberFormat('en-US', {
 minimumFractionDigits: decimals,
 maximumFractionDigits: decimals,
 }).format(value);
 },

 formatPercent(value: number, decimals = 1): string {
 return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
 },

 formatCompact(value: number): string {
 if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
 if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
 if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
 return value.toString();
 },

 getRelativeTime(date: Date): string {
 return formatDistanceToNow(date, { addSuffix: true });
 },

 getDefaultDateRange(period: 'month' | 'quarter' | 'year' | 'last30' | 'last90') {
 const end = new Date();
 let start: Date;
 switch (period) {
 case 'month':
 start = startOfMonth(end);
 end.setHours(23, 59, 59, 999);
 return { start, end, compareStart: subDays(start, 30), compareEnd: subDays(start, 1) };
 case 'quarter':
 start = startOfQuarter(end);
 return { start, end, compareStart: subDays(start, 90), compareEnd: subDays(start, 1) };
 case 'year':
 start = new Date(end.getFullYear(), 0, 1);
 return { start, end, compareStart: new Date(end.getFullYear() - 1, 0, 1), compareEnd: new Date(end.getFullYear() - 1, 11, 31) };
 case 'last30':
 start = subDays(end, 30);
 return { start, end, compareStart: subDays(start, 30), compareEnd: subDays(start, 1) };
 case 'last90':
 start = subDays(end, 90);
 return { start, end, compareStart: subDays(start, 90), compareEnd: subDays(start, 1) };
 }
 },
};
