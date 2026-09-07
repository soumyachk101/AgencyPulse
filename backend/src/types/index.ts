import { Prisma } from "@prisma/client";

// ── Enums as union types ──────────────────────────────────────────────────────

export type Role = "OWNER" | "ADMIN" | "MEMBER";
export type ClientStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type IntegrationProvider =
 | "GOOGLE_ANALYTICS"
 | "FACEBOOK_ADS"
 | "GOOGLE_ADS"
 | "HUBSPOT"
 | "SHOPIFY";
export type IntegrationStatus = "ACTIVE" | "EXPIRED" | "ERROR" | "PENDING";
export type ReportStatus = "DRAFT" | "GENERATING" | "READY" | "SENT" | "ERROR";
export type SubscriptionPlan = "STARTER" | "GROWTH" | "AGENCY" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING";

// ── Agency ────────────────────────────────────────────────────────────────────

export interface Agency extends Prisma.AgencyGetPayload<{}> {}

export interface AgencyCreateInput {
 name: string;
 slug: string;
 ownerId: string;
}

// ── User ─────────────────────────────────────────────────────────────────────

export interface User extends Prisma.UserGetPayload<{}> {
 // Never expose password outside auth flows
}

export interface UserCreateInput {
 email: string;
 password: string;
 name?: string;
 agencyId: string;
 role?: Role;
}

export interface UserLoginInput {
 email: string;
 password: string;
}

// ── Client ───────────────────────────────────────────────────────────────────

export interface Client extends Prisma.ClientGetPayload<{}> {}

export interface ClientCreateInput {
 name: string;
 email: string;
 company?: string;
 industry?: string;
 agencyId: string;
 createdById: string;
 metadata?: JsonValue;
}

export interface ClientUpdateInput {
 name?: string;
 email?: string;
 company?: string | null;
 industry?: string | null;
 status?: ClientStatus;
 metadata?: JsonValue;
}

// ── Integration ──────────────────────────────────────────────────────────────

export interface Integration extends Prisma.IntegrationGetPayload<{}> {}

export interface IntegrationCreateInput {
 clientId: string;
 provider: IntegrationProvider;
 name: string;
 accessToken?: string;
 refreshToken?: string;
 expiresAt?: Date;
 scope?: string;
 metadata?: JsonValue;
}

// ── Metric ───────────────────────────────────────────────────────────────────

export interface Metric extends Prisma.MetricGetPayload<{}> {}

export interface MetricCreateInput {
 clientId: string;
 date: Date;
 source: string;
 name: string;
 value: number;
 unit?: string;
 dimensions?: JsonValue;
}

export interface MetricsQuery {
 clientId: string;
 startDate?: string;
 endDate?: string;
 source?: string;
 name?: string;
 limit?: number;
 offset?: number;
}

// ── ReportTemplate ───────────────────────────────────────────────────────────

export interface ReportTemplate
 extends Prisma.ReportTemplateGetPayload<{}> {}

export interface ReportTemplateCreateInput {
 name: string;
 description?: string;
 agencyId: string;
 createdById: string;
 sections: unknown[];
 styles?: unknown;
 isPublic?: boolean;
 clientId?: string;
}

export interface ReportTemplateUpdateInput {
 name?: string;
 description?: string | null;
 sections?: unknown[];
 styles?: unknown;
 isPublic?: boolean;
}

// ── Report ───────────────────────────────────────────────────────────────────

export interface Report extends Prisma.ReportGetPayload<{}> {}

export interface ReportCreateInput {
 title: string;
 agencyId: string;
 clientId: string;
 templateId: string;
 createdById: string;
 description?: string;
 sections?: unknown[];
 metadata?: unknown;
 sendEmail?: boolean;
}

// ── Subscription ─────────────────────────────────────────────────────────────

export interface Subscription
 extends Prisma.SubscriptionGetPayload<{}> {}

// ── ScheduledReport ──────────────────────────────────────────────────────────

export interface ScheduledReport
 extends Prisma.ScheduledReportGetPayload<{}> {}

export interface ScheduledReportCreateInput {
 name: string;
 agencyId: string;
 frequency: string;
 cronExpression?: string;
 templateId: string;
 clientId?: string;
}

// ── Shared ───────────────────────────────────────────────────────────────────

export type JsonValue = Prisma.JsonValue;
export type JsonArray = Prisma.JsonArray;

export interface PaginationParams {
 page?: number;
 limit?: number;
}

export interface PaginatedResult<T> {
 data: T[];
 total: number;
 page: number;
 limit: number;
 totalPages: number;
}

export interface ApiResponse<T = unknown> {
 success: boolean;
 data?: T;
 error?: string;
 message?: string;
 meta?: Record<string, unknown>;
}

// ── JWT Payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
 userId: string;
 email: string;
 role: Role;
 agencyId: string;
 iat?: number;
 exp?: number;
}

// ── Integration Providers Config ─────────────────────────────────────────────

export interface ProviderConfig {
 name: string;
 authType: "oauth2" | "api_key";
 scopes?: string[];
 authorizeUrl?: string;
 tokenUrl?: string;
}

export const INTEGRATION_PROVIDERS: Record<IntegrationProvider, ProviderConfig> = {
 GOOGLE_ANALYTICS: {
 name: "Google Analytics",
 authType: "oauth2",
 scopes: [
 "https://www.googleapis.com/auth/analytics.readonly",
 ],
 authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
 tokenUrl: "https://oauth2.googleapis.com/token",
 },
 FACEBOOK_ADS: {
 name: "Facebook Ads",
 authType: "oauth2",
 scopes: [
 "ads_read",
 "business_management",
 "pages_read_engagement",
 ],
 authorizeUrl: "https://www.facebook.com/v18.0/dialog/oauth",
 tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
 },
 GOOGLE_ADS: {
 name: "Google Ads",
 authType: "oauth2",
 scopes: ["https://www.googleapis.com/auth/adwords"],
 authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
 tokenUrl: "https://oauth2.googleapis.com/token",
 },
 HUBSPOT: {
 name: "HubSpot",
 authType: "oauth2",
 scopes: ["crm.objects.read", "analytics.read"],
 authorizeUrl: "https://app.hubspot.com/oauth/authorize",
 tokenUrl: "https://api.hubapi.com/oauth/v1/token",
 },
 SHOPIFY: {
 name: "Shopify",
 authType: "oauth2",
 scopes: ["read_products", "read_orders", "read_analytics"],
 authorizeUrl: "https://{shop}/admin/oauth/authorize",
 tokenUrl: "https://{shop}/admin/oauth/access_token",
 },
};
