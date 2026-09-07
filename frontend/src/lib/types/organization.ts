export interface User {
 id: string;
 email: string;
 firstName: string;
 lastName: string;
 role: 'admin' | 'manager' | 'analyst';
 avatarUrl?: string;
 organizationId: string;
 createdAt: Date;
 updatedAt: Date;
}

export interface Organization {
 id: string;
 name: string;
 domain: string;
 plan: 'starter' | 'pro' | 'enterprise';
 status: 'active' | 'suspended' | 'pending';
 createdAt: Date;
 settings: OrganizationSettings;
 billing: BillingInfo;
}

export interface OrganizationSettings {
 timezone: string;
 dateFormat: string;
 currency: string;
 locale: string;
 branding: BrandingSettings;
}

export interface BrandingSettings {
 logoUrl?: string;
 primaryColor: string;
 secondaryColor: string;
 accentColor: string;
 fontFamily: string;
 customCss?: string;
}

export interface BillingInfo {
 subscriptionId?: string;
 currentPeriodStart?: Date;
 currentPeriodEnd?: Date;
 cancelAtPeriodEnd: boolean;
}
