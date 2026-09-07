export interface Client {
 id: string;
 organizationId: string;
 name: string;
 industry: string;
 website?: string;
 contactName: string;
 contactEmail: string;
 contactPhone?: string;
 address?: Address;
 notes?: string;
 status: 'active' | 'inactive' | 'archived';
 tags: string[];
 customFields: Record<string, unknown>;
 createdAt: Date;
 updatedAt: Date;
}

export interface Address {
 street: string;
 city: string;
 state: string;
 country: string;
 zipCode: string;
}

export interface ClientKPI {
 id: string;
 clientId: string;
 name: string;
 metric: string;
 value: number;
 previousValue: number;
 unit: string;
 trend: 'up' | 'down' | 'stable';
 changePercent: number;
 period: string;
 updatedAt: Date;
}
