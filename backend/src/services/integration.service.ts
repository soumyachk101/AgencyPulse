import { z } from "zod";
import { prisma } from "../lib/prisma";
import {
 ClientStatus,
 Integration,
 IntegrationProvider,
 IntegrationStatus,
} from "@prisma/client";
import { INTEGRATION_PROVIDERS } from "../types";
import { redis } from "../lib/redis";
import { BullQueue } from "../queue/bull-queue";

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
});

const syncQueue = BullQueue.syncQueue;

// ── Validation schemas ────────────────────────────────────────────────────────

const oauthCallbackSchema = z.object({
 provider: z.enum([
 "GOOGLE_ANALYTICS",
 "FACEBOOK_ADS",
 "GOOGLE_ADS",
 "HUBSPOT",
 "SHOPIFY",
 ]),
 code: z.string(),
 state: z.string(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildOAuthUrl(
 provider: IntegrationProvider,
 state: string,
 clientId: string
): string {
 const config = INTEGRATION_PROVIDERS[provider];
 const params = new URLSearchParams({
 response_type: "code",
 client_id: process.env[`${String(provider)}_CLIENT_ID`] ?? "",
 redirect_uri: `${process.env.APP_URL}/api/webhooks/oauth/${provider.toLowerCase()}`,
 scope: config.scopes?.join(" ") ?? "",
 state: `${state}:${clientId}`,
 access_type: "offline",
 prompt: "consent",
 });

 // Special handling for Shopify (shop-specific URL)
 if (provider === "SHOPIFY") {
 const shop = process.env.SHOPIFY_SHOP_DOMAIN;
 if (!shop) throw new Error("SHOPIFY_SHOP_DOMAIN must be set");
 return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
 }

 return `${config.authorizeUrl}?${params.toString()}`;
}

async function exchangeCodeForToken(
 provider: IntegrationProvider,
 code: string
): Promise<{
 accessToken: string;
 refreshToken?: string;
 expiresAt?: Date;
 scope?: string;
}> {
 const tokenUrl =
 provider === "SHOPIFY"
 ? `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/oauth/access_token`
 : INTEGRATION_PROVIDERS[provider].tokenUrl;

 const response = await fetch(tokenUrl!, {
 method: "POST",
 headers: { "Content-Type": "application/x-www-form-urlencoded" },
 body: new URLSearchParams({
 grant_type: "authorization_code",
 client_id: process.env[`${String(provider)}_CLIENT_ID`]!,
 client_secret: process.env[`${String(provider)}_CLIENT_SECRET`]!,
 code,
 redirect_uri: `${process.env.APP_URL}/api/webhooks/oauth/${provider.toLowerCase()}`,
 }),
 });

 if (!response.ok) {
 const err = await response.text();
 throw new Error(`OAuth token exchange failed: ${err}`);
 }

 const data = await response.json();
 const expiresAt = data.expires_in
 ? new Date(Date.now() + data.expires_in * 1000)
 : undefined;

 return {
 accessToken: data.access_token,
 refreshToken: data.refresh_token,
 expiresAt,
 scope: data.scope,
 };
}

// ── Public methods ────────────────────────────────────────────────────────────

export class IntegrationService {
 /**
 * Initiate OAuth flow - returns the authorization URL.
 */
 static async authorize(
 clientId: string,
 provider: IntegrationProvider,
 userId: string
 ): Promise<{ url: string; state: string }> {
 const state = `${userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
 // Store state temporarily in Redis
 await redis.setEx(
 `oauth:state:${state}`,
 600, // 10 minutes TTL
 JSON.stringify({ clientId, userId, provider })
 );

 const url = buildOAuthUrl(provider, state, clientId);
 return { url, state };
 }

 /**
 * Handle OAuth callback from provider.
 */
 static async handleCallback(
 code: string,
 state: string
 ): Promise<Integration> {
 const parsed = oauthCallbackSchema
 .extend({ clientId: z.string() })
 .parse({ code, state });

 const stateData = await redis.get(`oauth:state:${state}`);
 if (!stateData) {
 throw new Error("Invalid or expired OAuth state");
 }
 const { clientId, userId } = JSON.parse(stateData) as {
 clientId: string;
 userId: string;
 provider: IntegrationProvider;
 };
 await redis.del(`oauth:state:${state}`);

 // Verify client belongs to the same agency as the user
 const user = await prisma.user.findUnique({
 where: { id: userId },
 select: { agencyId: true },
 });
 const client = await prisma.client.findUnique({
 where: { id: clientId },
 select: { agencyId: true },
 });

 if (!user || !client || user.agencyId !== client.agencyId) {
 throw new Error("Unauthorized: client does not belong to your agency");
 }

 const tokens = await exchangeCodeForToken(parsed.provider, code);

 const integration = await prisma.integration.create({
 data: {
 clientId,
 provider: parsed.provider,
 name: INTEGRATION_PROVIDERS[parsed.provider].name,
 accessToken: tokens.accessToken,
 refreshToken: tokens.refreshToken,
 expiresAt: tokens.expiresAt,
 scope: tokens.scope,
 status: "ACTIVE",
 metadata: {},
 },
 });

 // Trigger initial sync
 await syncQueue.add("sync-integration", {
 integrationId: integration.id,
 provider: parsed.provider,
 clientId,
 });

 return integration;
 }

 /**
 * Get all integrations for a client.
 */
 static async listByClient(clientId: string): Promise<Integration[]> {
 return prisma.integration.findMany({
 where: { clientId },
 orderBy: { createdAt: "desc" },
 select: {
 id: true,
 provider: true,
 name: true,
 status: true,
 lastSyncAt: true,
 lastError: true,
 expiresAt: true,
 createdAt: true,
 updatedAt: true,
 // Never expose tokens in list
 accessToken: false,
 refreshToken: false,
 },
 });
 }

 /**
 * Get a single integration by ID.
 */
 static async getById(integrationId: string): Promise<Integration | null> {
 return prisma.integration.findUnique({
 where: { id: integrationId },
 });
 }

 /**
 * Remove an integration.
 */
 static async remove(integrationId: string): Promise<void> {
 await prisma.integration.delete({
 where: { id: integrationId },
 });
 }

 /**
 * Trigger a manual sync for an integration.
 */
 static async triggerSync(
 integrationId: string
 ): Promise<{ jobId: string }> {
 const integration = await prisma.integration.findUnique({
 where: { id: integrationId },
 });

 if (!integration) {
 throw new Error("Integration not found");
 }

 const job = await syncQueue.add("sync-integration", {
 integrationId,
 provider: integration.provider,
 clientId: integration.clientId,
 });

 return { jobId: job.id };
 }

 /**
 * Get available OAuth providers.
 */
 static getProviders(): Record<
 IntegrationProvider,
 {
 name: string;
 authType: "oauth2" | "api_key";
 authorizedUrl?: string;
 }
> {
 return Object.entries(INTEGRATION_PROVIDERS).reduce(
 (acc, [key, config]) => {
 acc[key as IntegrationProvider] = {
 name: config.name,
 authType: config.authType,
 authorizedUrl: config.authorizeUrl,
 };
 return acc;
 },
 {} as Record<
 IntegrationProvider,
 { name: string; authType: "oauth2" | "api_key"; authorizedUrl?: string }
 >
 );
 }
}
