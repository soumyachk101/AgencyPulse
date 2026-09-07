import { prisma } from "../lib/prisma";
import { Integration, IntegrationProvider, Metric } from "@prisma/client";
import { BullQueue } from "../queue/bull-queue";

import OpenAI from "openai";

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
});

const reportQueue = BullQueue.reportQueue;

// ── Google Analytics fetcher ──────────────────────────────────────────────────

async function fetchGoogleAnalytics(
 integration: Integration,
 startDate: Date,
 endDate: Date
): Promise<Partial<Metric>[]> {
 // Pseudo: call Google Analytics Reporting API
 // This is a placeholder — replace with real GA4 Data API calls
 const metrics: Partial<Metric>[] = [];
 // fetch from https://analyticsdata.googleapis.com/v1beta/properties/{propertyId}:runReport
 return metrics;
}

// ── Facebook Ads fetcher ──────────────────────────────────────────────────────

async function fetchFacebookAds(
 integration: Integration,
 startDate: Date,
 endDate: Date
): Promise<Partial<Metric>[]> {
 const metrics: Partial<Metric>[] = [];
 // fetch from https://graph.facebook.com/v18.0/act_{adAccountId}/insights
 return metrics;
}

// ── Google Ads fetcher ────────────────────────────────────────────────────────

async function fetchGoogleAds(
 integration: Integration,
 startDate: Date,
 endDate: Date
): Promise<Partial<Metric>[]> {
 const metrics: Partial<Metric>[] = [];
 // fetch from https://googleads.googleapis.com/v18/customers/{customerId}/googleAdsFields
 return metrics;
}

// ── HubSpot fetcher ──────────────────────────────────────────────────────────

async function fetchHubSpot(
 integration: Integration,
 startDate: Date,
 endDate: Date
): Promise<Partial<Metric>[] & { leads?: number }> {
 const metrics: Partial<Metric>[] = [];
 // fetch from https://api.hubapi.com/crm/v3/objects/contacts
 // ... plus deal pipelines, etc.
 return metrics;
}

// ── Shopify fetcher ──────────────────────────────────────────────────────────

async function fetchShopify(
 integration: Integration,
 startDate: Date,
 endDate: Date
): Promise<Partial<Metric>[] & { revenue?: number }> {
 const metrics: Partial<Metric>[] = [];
 // fetch from https://{shop}.myshopify.com/admin/api/2024-01/orders.json
 return metrics;
}

// ── AI Narrative Generation ──────────────────────────────────────────────────

async function generateAINarrative(
 clientName: string,
 periodStart: string,
 periodEnd: string,
 metrics: Array<{ name: string; value: number; unit?: string; source: string }>,
 context?: string
): Promise<string> {
 if (!process.env.OPENAI_API_KEY) {
 return "AI narrative unavailable — OPENAI_API_KEY not configured.";
 }

 const prompt = `You are a marketing analyst writing for a client report.
 Client: ${clientName}
 Period: ${periodStart} to ${periodEnd}

 Here are the key metrics collected:
 ${metrics
 .map(
 (m) =>
 `- ${m.name} (${m.source}): ${m.value}${m.unit ? ` ${m.unit}` : ""}`
 )
 .join("\n")}

 ${context ? `Additional context: ${context}\n` : ""}

 Write a concise, professional narrative (3-5 sentences) summarizing the performance.
 Focus on insights, not just raw numbers. Use a confident but neutral tone.`;

 try {
 const completion = await openai.chat.completions.create({
 model: "gpt-4o-mini",
 messages: [
 {
 role: "system",
 content:
 "You are a professional marketing analyst generating client report narratives.",
 },
 { role: "user", content: prompt },
 ],
 max_tokens: 500,
 temperature: 0.7,
 });

 return (
 completion.choices[0]?.message?.content?.trim() ??
 "No narrative generated."
 );
 } catch (error) {
 console.error("OpenAI error:", error);
 return "Unable to generate narrative at this time.";
 }
}

// ── Sync dispatcher ───────────────────────────────────────────────────────────

const providerFetchers: Record<
 IntegrationProvider,
 (
 integration: Integration,
 startDate: Date,
 endDate: Date
 ) => Promise<Partial<Metric>[]>
> = {
 GOOGLE_ANALYTICS: fetchGoogleAnalytics,
 FACEBOOK_ADS: fetchFacebookAds,
 GOOGLE_ADS: fetchGoogleAds,
 HUBSPOT: fetchHubSpot,
 SHOPIFY: fetchShopify,
};

// ── Public ───────────────────────────────────────────────────────────────────

export class DataSyncService {
 /**
 * Sync all active integrations for a client.
 */
 static async syncClient(clientId: string, daysBack = 30): Promise<void> {
 const integrations = await prisma.integration.findMany({
 where: { clientId, status: "ACTIVE" },
 });

 const endDate = new Date();
 const startDate = new Date();
 startDate.setDate(startDate.getDate() - daysBack);

 for (const integration of integrations) {
 await this.syncIntegration(integration, startDate, endDate);
 }
 }

 /**
 * Sync a single integration.
 */
 static async syncIntegration(
 integration: Integration,
 startDate: Date,
 endDate: Date
 ): Promise<{ metricsCreated: number }> {
 const fetcher = providerFetchers[integration.provider];
 if (!fetcher) {
 throw new Error(`No fetcher for provider: ${integration.provider}`);
 }

 try {
 const rawMetrics = await fetcher(integration, startDate, endDate);

 let created = 0;
 for (const m of rawMetrics) {
 if (!m.name || m.value === undefined || !m.date) continue;

 await prisma.metric.upsert({
 where: {
 clientId_date_source_name: {
 clientId: integration.clientId,
 date: m.date instanceof Date ? m.date : new Date(m.date),
 source: integration.provider,
 name: m.name,
 },
 },
 create: {
 clientId: integration.clientId,
 date: m.date instanceof Date ? m.date : new Date(m.date),
 source: integration.provider,
 name: m.name,
 value: m.value,
 unit: m.unit ?? null,
 dimensions: m.dimensions ?? undefined,
 },
 update: {
 value: m.value,
 unit: m.unit ?? undefined,
 dimensions: m.dimensions ?? undefined,
 },
 });

 created++;
 }

 // Update integration record
 await prisma.integration.update({
 where: { id: integration.id },
 data: {
 lastSyncAt: new Date(),
 lastError: null,
 status: "ACTIVE",
 },
 });

 return { metricsCreated: created };
 } catch (error) {
 await prisma.integration.update({
 where: { id: integration.id },
 data: {
 lastError: error instanceof Error ? error.message : "Unknown sync error",
 status: "ERROR",
 },
 });
 throw error;
 }
 }

 /**
 * Generate AI narrative for a report.
 */
 static async generateNarrative(
 clientName: string,
 periodStart: string,
 periodEnd: string,
 metricIds: string[],
 context?: string
 ): Promise<string> {
 const metrics = await prisma.metric.findMany({
 where: { id: { in: metricIds } },
 select: { name: true, value: true, unit: true, source: true },
 });

 const formatted = metrics.map((m) => ({
 name: m.name,
 value: m.value,
 unit: m.unit ?? undefined,
 source: m.source,
 }));

 return generateAINarrative(clientName, periodStart, periodEnd, formatted, context);
 }
}
