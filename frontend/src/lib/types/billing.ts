export interface BillingInfo {
 id: string;
 organizationId: string;
 plan: 'starter' | 'pro' | 'enterprise';
 status: 'active' | 'past_due' | 'canceled' | 'pending';
 currentPeriodStart: Date;
 currentPeriodEnd: Date;
 cancelAtPeriodEnd: boolean;
 usage: UsageMetrics;
 invoices: Invoice[];
 paymentMethod?: PaymentMethod;
}

export interface UsageMetrics {
 clientsCount: number;
 reportsGenerated: number;
 integrationsCount: number;
 apiCalls: number;
 storageUsed: number;
 limits: UsageLimits;
}

export interface UsageLimits {
 maxClients: number;
 maxReports: number;
 maxIntegrations: number;
 maxApiCalls: number;
 maxStorage: number;
}

export interface Invoice {
 id: string;
 amount: number;
 currency: string;
 status: 'paid' | 'pending' | 'failed' | 'void';
 periodStart: Date;
 periodEnd: Date;
 dueDate: Date;
 paidAt?: Date;
 pdfUrl?: string;
 createdAt: Date;
}

export interface PaymentMethod {
 id: string;
 type: 'card' | 'bank_transfer';
 last4?: string;
 brand?: string;
 expiryMonth?: number;
 expiryYear?: number;
 isDefault: boolean;
}
