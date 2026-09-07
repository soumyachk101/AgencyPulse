/**
 * scripts/seed.ts
 *
 * Seeds demo agency, users, clients, integrations, report templates,
 * and a scheduled report. Safe to run multiple times (idempotent upserts).
 *
 * Usage:
 * npx tsx scripts/seed.ts
 *
 * Environment:
 * DATABASE_URL (required)
 */

import { PrismaClient, Role, ClientStatus, IntegrationProvider, IntegrationStatus, SubscriptionPlan, SubscriptionStatus, ReportStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
 console.log("Seeding AgencyPulse demo data…\n");

 // ── Agency Owner (must exist before Agency due to ownerId FK) ──
 const owner = await prisma.user.upsert({
 where: { email: "owner@demoagency.com" },
 update: {},
 create: {
 email: "owner@demoagency.com",
 name: "Alex Owner",
 role: Role.OWNER,
 emailVerified: true,
 },
 });
 console.log(`User: ${owner.email} (OWNER)`);

 // ── Agency ────────────────────────────────────────────────
 const agency = await prisma.agency.upsert({
 where: { slug: "demo-agency" },
 update: {},
 create: {
 name: "Demo Agency",
 slug: "demo-agency",
 ownerId: owner.id,
 },
 });
 console.log(`Agency: ${agency.name} (id=${agency.id})`);

 // ── Additional Users ──────────────────────────────────────
 const manager = await prisma.user.upsert({
 where: { email: "manager@demoagency.com" },
 update: {},
 create: {
 email: "manager@demoagency.com",
 name: "Jordan Manager",
 role: Role.ADMIN,
 agencyId: agency.id,
 emailVerified: true,
 },
 });
 console.log(`User: ${manager.email} (ADMIN)`);

 const member = await prisma.user.upsert({
 where: { email: "member@demoagency.com" },
 update: {},
 create: {
 email: "member@demoagency.com",
 name: "Taylor Member",
 role: Role.MEMBER,
 agencyId: agency.id,
 emailVerified: true,
 },
 });
 console.log(`User: ${member.email} (MEMBER)`);

 // ── Clients ───────────────────────────────────────────────
 const clients = [
 {
 name: "Acme Corp",
 email: "contact@acme.example.com",
 company: "Acme Corp",
 industry: "Technology",
 monthlyBudget: 15000,
 },
 {
 name: "Bright Health",
 email: "contact@brighthealth.example.com",
 company: "Bright Health",
 industry: "Healthcare",
 monthlyBudget: 8500,
 },
 {
 name: "GreenLeaf Organics",
 email: "contact@greenleaf.example.com",
 company: "GreenLeaf Organics",
 industry: "E-commerce",
 monthlyBudget: 6200,
 },
 ];

 const createdClients: { id: string; name: string; email: string }[] = [];

 for (const c of clients) {
 const client = await prisma.client.upsert({
 where: { id: `${agency.id}-${c.name.toLowerCase().replace(/\s+/g, "-")}` },
 update: c,
 create: {
 ...c,
 agencyId: agency.id,
 createdById: owner.id,
 status: ClientStatus.ACTIVE,
 metadata: {},
 },
 });
 createdClients.push({ id: client.id, name: client.name, email: client.email });
 console.log(`Client: ${client.name} (id=${client.id})`);
 }

 // ── Integrations (linked to clients, not agency) ──────────
 const integrations: { clientId: string; provider: IntegrationProvider; name: string; accessToken?: string; metadata?: Record<string, unknown> }[] = [
 { clientId: createdClients[0].id, provider: IntegrationProvider.GOOGLE_ANALYTICS, name: "GA4 — Acme", accessToken: "demo_ga_token", metadata: { propertyId: "G-DEMO123" } },
 { clientId: createdClients[0].id, provider: IntegrationProvider.GOOGLE_ADS, name: "Google Ads — Acme", accessToken: "demo_gads_token", metadata: { customerId: "123-456-7890" } },
 { clientId: createdClients[1].id, provider: IntegrationProvider.FACEBOOK_ADS, name: "Meta Ads — Bright", accessToken: "demo_meta_token", metadata: { adAccountId: "act_9876543210" } },
 { clientId: createdClients[2].id, provider: IntegrationProvider.HUBSPOT, name: "HubSpot CRM", accessToken: "demo_hubspot_token", metadata: { portalId: "45678901" } },
 { clientId: createdClients[2].id, provider: IntegrationProvider.SHOPIFY, name: "Shopify Store", accessToken: "demo_shopify_token", metadata: { shopDomain: "greenleaf.myshopify.com" } },
 ];

 for (const integ of integrations) {
 const uniqueKey = `${integ.clientId}-${integ.provider}-${integ.name}`;
 const record = await prisma.integration.upsert({
 where: { id: uniqueKey },
 update: { accessToken: integ.accessToken, metadata: integ.metadata, status: IntegrationStatus.ACTIVE },
 create: {
 id: uniqueKey,
 clientId: integ.clientId,
 provider: integ.provider,
 name: integ.name,
 accessToken: integ.accessToken,
 metadata: integ.metadata,
 status: IntegrationStatus.ACTIVE,
 },
 });
 console.log(`Integration: ${record.provider} — ${record.name}`);
 }

 // ── Report Templates ──────────────────────────────────────
 const templates = [
 {
 name: "Monthly Performance Summary",
 description: "Standard monthly overview across all channels.",
 isPublic: false,
 sections: [
 { type: "executive_summary", title: "Executive Summary" },
 { type: "channel_breakdown", title: "Channel Breakdown" },
 { type: "kpi_table", title: "Key Metrics" },
 { type: "chart", title: "Budget vs Spend", chartType: "budget_vs_spend" },
 { type: "chart", title: "Conversion Funnel", chartType: "conversion_funnel" },
 { type: "chart", title: "Channel ROI", chartType: "channel_roi" },
 { type: "recommendations", title: "Recommendations" },
 ],
 styles: { primaryColor: "#4F46E5" },
 },
 {
 name: "Quarterly Strategy Review",
 description: "Quarterly deep-dive with strategic recommendations.",
 isPublic: false,
 sections: [
 { type: "executive_summary", title: "Executive Summary" },
 { type: "channel_breakdown", title: "Channel Breakdown" },
 { type: "kpi_table", title: "Key Metrics" },
 { type: "chart", title: "Budget vs Spend", chartType: "budget_vs_spend" },
 { type: "chart", title: "Channel ROI", chartType: "channel_roi" },
 { type: "chart", title: "Lead Quality Trend", chartType: "lead_quality_trend" },
 { type: "competitor_benchmark", title: "Competitor Benchmark" },
 { type: "recommendations", title: "Recommendations" },
 ],
 styles: { primaryColor: "#059669" },
 },
 {
 name: "Campaign Launch Brief",
 description: "Pre-launch briefing for a new marketing campaign.",
 isPublic: false,
 sections: [
 { type: "executive_summary", title: "Campaign Overview" },
 { type: "kpi_table", title: "Expected KPIs" },
 { type: "chart", title: "Projected Reach", chartType: "projected_reach" },
 { type: "recommendations", title: "Risk Mitigation" },
 ],
 styles: { primaryColor: "#DC2626" },
 },
 ];

 for (const tpl of templates) {
 const uniqueKey = `${agency.id}-${tpl.name.toLowerCase().replace(/\s+/g, "-")}`;
 const record = await prisma.reportTemplate.upsert({
 where: { id: uniqueKey },
 update: { sections: tpl.sections, styles: tpl.styles, description: tpl.description },
 create: {
 id: uniqueKey,
 name: tpl.name,
 description: tpl.description,
 sections: tpl.sections,
 styles: tpl.styles,
 isPublic: tpl.isPublic,
 agencyId: agency.id,
 createdById: owner.id,
 },
 });
 console.log(`Template: ${record.name} (id=${record.id})`);
 }

 // ── Subscription ──────────────────────────────────────────
 const subscription = await prisma.subscription.upsert({
 where: { id: `${agency.id}-sub` },
 update: { plan: SubscriptionPlan.AGENCY, status: SubscriptionStatus.ACTIVE },
 create: {
 id: `${agency.id}-sub`,
 agencyId: agency.id,
 plan: SubscriptionPlan.AGENCY,
 status: SubscriptionStatus.ACTIVE,
 currentPeriodStart: new Date(),
 currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
 },
 });
 console.log(`Subscription: ${subscription.plan} (${subscription.status})`);

 // ── Sample Metrics ────────────────────────────────────────
 const firstClient = createdClients[0];
 const metricSources = ["google_analytics", "google_ads", "facebook_ads"];
 const metricNames: Record<string, string[]> = {
 google_analytics: ["sessions", "bounce_rate", "avg_session_duration"],
 google_ads: ["impressions", "clicks", "cost_per_conversion"],
 facebook_ads: ["reach", "frequency", "roas"],
 };

 for (let i = 30; i >= 0; i--) {
 const date = new Date();
 date.setDate(date.getDate() - i);

 for (const source of metricSources) {
 for (const metricName of metricNames[source]) {
 let value: number;
 switch (metricName) {
 case "sessions": value = 500 + Math.random() * 2000; break;
 case "bounce_rate": value = 30 + Math.random() * 30; break;
 case "avg_session_duration": value = 60 + Math.random() * 300; break;
 case "impressions": value = 5000 + Math.random() * 20000; break;
 case "clicks": value = 100 + Math.random() * 1000; break;
 case "cost_per_conversion": value = 10 + Math.random() * 50; break;
 case "reach": value = 2000 + Math.random() * 10000; break;
 case "frequency": value = 1 + Math.random() * 5; break;
 case "roas": value = 1 + Math.random() * 8; break;
 default: value = Math.random() * 100;
 }

 await prisma.metric.upsert({
 where: { id: `${firstClient.id}-${source}-${metricName}-${date.toISOString().split("T")[0]}` },
 update: { value },
 create: {
 id: `${firstClient.id}-${source}-${metricName}-${date.toISOString().split("T")[0]}`,
 clientId: firstClient.id,
 date,
 source,
 name: metricName,
 value: Math.round(value * 100) / 100,
 unit: metricName === "avg_session_duration" ? "seconds" : metricName === "cost_per_conversion" || metricName === "roas" ? "usd" : "count",
 dimensions: { client: firstClient.name },
 },
 });
 }
 }
 }
 console.log("Metrics: 30 days of sample data created.");

 // ── Scheduled Report ──────────────────────────────────────
 const monthlyTemplate = await prisma.reportTemplate.findFirst({
 where: { agencyId: agency.id, name: { contains: "Monthly" } },
 });

 if (monthlyTemplate) {
 const scheduled = await prisma.scheduledReport.upsert({
 where: { id: `${agency.id}-sched-monthly` },
 update: {},
 create: {
 id: `${agency.id}-sched-monthly`,
 name: "Monthly Performance Report",
 frequency: "monthly",
 cronExpression: "0 8 1 * *",
 isActive: true,
 nextRunAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 agencyId: agency.id,
 clientId: firstClient.id,
 templateId: monthlyTemplate.id,
 },
 });
 console.log(`Scheduled Report: ${scheduled.name} (${scheduled.frequency})`);
 }

 // ── Sample Reports ────────────────────────────────────────
 const sampleReport = await prisma.report.upsert({
 where: { id: `${agency.id}-report-sample` },
 update: {},
 create: {
 id: `${agency.id}-report-sample`,
 title: "Sample Monthly Report — Acme Corp",
 description: "Demonstration report generated from seed data.",
 status: ReportStatus.READY,
 agencyId: agency.id,
 clientId: firstClient.id,
 templateId: monthlyTemplate!.id,
 createdById: owner.id,
 sections: {
 summary: "Acme Corp had a strong month with 15% growth in sessions.",
 highlights: ["Sessions up 15% MoM", "ROAS improved to 4.2x", "Bounce rate decreased by 3%"],
 },
 metadata: { generatedAt: new Date().toISOString() },
 },
 });
 console.log(`Report: ${sampleReport.title} (${sampleReport.status})`);

 console.log("\n✅ Seed complete.");
}

main()
 .catch((e) => {
 console.error("❌ Seeding failed:", e);
 process.exit(1);
 })
 .finally(async () => {
 await prisma.$disconnect();
 });
