import { format, formatDistanceToNow, format as dateFormat } from 'date-fns';

export const formatUtils = {
 formatCurrency(value: number, currency = 'USD'): string {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency,
 minimumFractionDigits: 0,
 maximumFractionDigits: 0,
 }).format(value);
 },

 formatNumber(value: number, decimals = 0): string {
 if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
 if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
 if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
 return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
 },

 formatPercent(value: number, decimals = 1): string {
 return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
 },

 formatDate(date: Date | string, pattern = 'MMM dd, yyyy'): string {
 return dateFormat(typeof date === 'string' ? new Date(date) : date, pattern);
 },

 formatDateTime(date: Date | string): string {
 return dateFormat(typeof date === 'string' ? new Date(date) : date, 'MMM dd, yyyy HH:mm');
 },

 getRelativeTime(date: Date | string): string {
 return formatDistanceToNow(typeof date === 'string' ? new Date(date) : date, { addSuffix: true });
 },

 truncate(str: string, maxLength = 50): string {
 if (str.length <= maxLength) return str;
 return str.slice(0, maxLength) + '...';
 },

 capitalize(str: string): string {
 return str.charAt(0).toUpperCase() + str.slice(1);
 },
};
