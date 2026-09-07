import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import { BullQueue, QUEUE_NAMES } from "./bull-queue";
import { DataSyncService } from "../services/data-sync.service";
import { ReportService } from "../services/report.service";
import { prisma } from "../lib/prisma";
import { logger } from "../monitoring/logger";
import crypto from "crypto";

// ── Queue initialisation ──────────────────────────────────────────────────────

BullQueue.init();

// ── Token refresh helper ──────────────────────────────────────────────────────

async function refreshAccessToken(
 provider: string,
 refreshToken: string
): Promise<string> {
 const tokenUrls: Record<string, string> = {
 GOOGLE_ANALYTICS: "https://oauth2.googleapis.com/token",
 FACEBOOK_ADS: "https://graph.facebook.com/v18.0/oauth/access_token",
 HUBSPOT: "https://api.hubapi.com/oauth/v1/token",
 };

 const url = tokenUrls[provider];
 if (!url) return refreshToken;

 const clientId = process.env[`${provider}_CLIENT_ID`];
 const clientSecret = process.env[`${provider}_CLIENT_SECRET`];

 const response = await fetch(url, {
 method: "POST",
 headers: { "Content-Type": "application/x-www-form-urlencoded" },
 body: new URLSearchParams({
 grant_type: "refresh_token",
 client_id: clientId ?? "",
 client_secret: clientSecret ?? "",
 refresh_token: refreshToken,
 }),
 });

 if (!response.ok) throw new Error("Token refresh failed");

 const data = await response.json();
 return data.access_token ?? refreshToken;
}

function signPayload(payload: string, secret: string): string {
 return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

// ── Sync worker ──────────────────────────────────────────────────────────────

const syncWorker = new Worker(
 QUEUE_NAMES.SYNC,
 async (job) => {
 const { integrationId } = job.data;

 logger.info(
 { integrationId, jobId: job.id },
 "Processing sync job"
 );

 const integration = await prisma.integration.findUnique({
 where: { id: integrationId },
 });

 if (!integration) {
 logger.warn({ integrationId }, "Integration not found, skipping");
 return;
 }

 let accessToken = integration.accessToken;

 // Refresh token if expired
 if (
 integration.refreshToken &&
 integration.expiresAt &&
 integration.expiresAt < new Date()
 ) {
 logger.info({ integrationId }, "Refreshing expired access token");
 try {
 accessToken = await refreshAccessToken(
 integration.provider,
 integration.refreshToken
 );
 await prisma.integration.update({
 where: { id: integrationId },
 data: { accessToken, expiresAt: new Date(Date.now() + 3600 * 1000) },
 });
 } catch (err) {
 logger.error({ integrationId, err }, "Token refresh failed");
 }
 }

 const endDate = new Date();
 const startDate = new Date();
 startDate.setDate(startDate.getDate() - 30);

 try {
 await DataSyncService.syncIntegration(integration, startDate, endDate);
 logger.info({ integrationId }, "Sync complete");
 } catch (err) {
 logger.error({ integrationId, err }, "Sync failed");
 await prisma.integration.update({
 where: { id: integrationId },
 data: {
 lastError: err instanceof Error ? err.message : "Sync failed",
 status: "ERROR",
 },
 });
 throw err;
 }
 },
 { connection: redis, concurrency: 5 }
);

// ── Report worker ─────────────────────────────────────────────────────────────

const reportWorker = new Worker(
 QUEUE_NAMES.REPORT,
 async (job) => {
 if (job.name === "generate-report") {
 const { reportId } = job.data;
 logger.info({ reportId }, "Generating report");
 await ReportService.generateReport(reportId);
 }
 },
 { connection: redis, concurrency: 2 }
);

// ── Webhook worker ────────────────────────────────────────────────────────────

const webhookWorker = new Worker(
 QUEUE_NAMES.WEBHOOK,
 async (job) => {
 const { url, event, payload, secret } = job.data;
 logger.info({ url, event }, "Delivering webhook");

 try {
 const body = JSON.stringify({ event, payload, timestamp: Date.now() });
 const signature = secret ? signPayload(body, secret) : undefined;

 const response = await fetch(url, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 ...(signature ? { "X-AgencyPulse-Signature": signature } : {}),
 },
 body,
 });

 if (!response.ok) {
 const text = await response.text();
 throw new Error(`Webhook returned ${response.status}: ${text}`);
 }

 logger.info({ url, event, status: response.status }, "Webhook delivered");
 } catch (error) {
 logger.error({ url, event, error }, "Webhook delivery failed");
 throw error;
 }
 },
 { connection: redis, concurrency: 10 }
);

// ── Event listeners ───────────────────────────────────────────────────────────

for (const worker of [syncWorker, reportWorker, webhookWorker]) {
 worker.on("completed", (job) => {
 logger.debug({ jobId: job.id, queue: worker.queueName }, "Job completed");
 });

 worker.on("failed", (job, err) => {
 logger.error(
 { jobId: job?.id, queue: worker.queueName, error: err.message },
 "Job failed"
 );
 });

 worker.on("error", (err) => {
 logger.error(err, "Worker error");
 });
}

logger.info("BullMQ workers started");

// ── Graceful shutdown ─────────────────────────────────────────────────────────

process.on("SIGINT", async () => {
 logger.info("Shutting down workers...");
 await syncWorker.close();
 await reportWorker.close();
 await webhookWorker.close();
 process.exit(0);
});

process.on("SIGTERM", async () => {
 logger.info("Shutting down workers...");
 await syncWorker.close();
 await reportWorker.close();
 await webhookWorker.close();
 process.exit(0);
});
