export type PlatformType = 'google_analytics' | 'facebook' | 'google_ads' | 'hubspot' | 'shopify' | 'linkedin' | 'twitter' | 'tiktok';

export interface Integration {
 id: string;
 clientId: string;
 organizationId: string;
 platform: PlatformType;
 status: 'connected' | 'disconnected' | 'error' | 'expired' | 'pending';
 accountName?: string;
 accountId?: string;
 scopes: string[];
 lastSyncAt?: Date;
 lastSyncStatus?: 'success' | 'failed' | 'partial';
 syncFrequency: 'hourly' | 'daily' | 'weekly';
 errorMessage?: string;
 tokenExpiresAt?: Date;
 createdAt: Date;
 updatedAt: Date;
}

export interface SyncJob {
 id: string;
 integrationId: string;
 status: 'running' | 'completed' | 'failed' | 'queued';
 startedAt?: Date;
 completedAt?: Date;
 recordsProcessed: number;
 errorMessage?: string;
 createdAt: Date;
}

export const PLATFORM_CONFIG: Record<PlatformType, {
 name: string;
 icon: string;
 color: string;
 authType: 'oauth2';
 scopes: string[];
}> = {
 google_analytics: {
 name: 'Google Analytics',
 icon: '📊',
 color: '#FF6B6B',
 authType: 'oauth2',
 scopes: ['analytics.readonly'],
 },
 facebook: {
 name: 'Facebook Ads',
 icon: '📘',
 color: '#1877F2',
 authType: 'oauth2',
 scopes: ['ads_read', 'pages_read_engagement'],
 },
 google_ads: {
 name: 'Google Ads',
 icon: '🔍',
 color: '#4285F4',
 authType: 'oauth2',
 scopes: ['adwords.readonly'],
 },
 hubspot: {
 name: 'HubSpot',
 icon: '🧡',
 color: '#FF7A59',
 authType: 'oauth2',
 scopes: ['crm.objects.contacts.read'],
 },
 shopify: {
 name: 'Shopify',
 icon: '🛒',
 color: '#96BF48',
 authType: 'oauth2',
 scopes: ['read_products', 'read_orders'],
 },
 linkedin: {
 name: 'LinkedIn Ads',
 icon: '💼',
 color: '#0A66C2',
 authType: 'oauth2',
 scopes: ['r_ads', 'r_organization_social'],
 },
 twitter: {
 name: 'Twitter/X',
 icon: '🐦',
 color: '#000000',
 authType: 'oauth2',
 scopes: ['tweet.read', 'users.read'],
 },
 tiktok: {
 name: 'TikTok Ads',
 icon: '🎵',
 color: '#000000',
 authType: 'oauth2',
 scopes: ['ads:read'],
 },
};
