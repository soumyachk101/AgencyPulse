import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";

import { initSentry } from "./monitoring/sentry";
import { errorHandler } from "./middlewares/errorHandler";
import { authRoutes } from "./routes/auth";
import { agencyRoutes } from "./routes/agencies";
import { clientRoutes } from "./routes/clients";
import { integrationRoutes } from "./routes/integrations";
import { metricsRoutes } from "./routes/metrics";
import { templateRoutes } from "./routes/templates";
import { reportRoutes } from "./routes/reports";
import { subscriptionRoutes } from "./routes/subscriptions";
import { webhookRoutes } from "./routes/webhooks";
import { healthRoutes } from "./routes/health";
import { BullQueue } from "./queue/bull-queue";

import { logger } from "./monitoring/logger";

// ── App initialisation ────────────────────────────────────────────────────────

const fastify = Fastify({
 logger: false, // We use our own pino instance
 requestIdHeader: "x-request-id",
 disableRequestLogging: true,
});

// ── Error handling ────────────────────────────────────────────────────────────

fastify.setErrorHandler(errorHandler);

// ── Plugins ──────────────────────────────────────────────────────────────────

await fastify.register(cors, {
 origin: process.env.FRONTEND_URL?.split(",").map((s) => s.trim()) ?? true,
 credentials: true,
});

await fastify.register(jwt, {
 secret: process.env.JWT_SECRET ?? "fallback-secret-change-in-production",
 sign: {
 expiresIn: process.env.JWT_EXPIRY ?? "7d",
 },
});

await fastify.register(rateLimit, {
 max: 100,
 timeWindow: "1 minute",
 keyGenerator: (request) => {
 const user = request.user as { userId?: string } | undefined;
 return user?.userId ?? request.ip;
 },
});

await fastify.register(multipart, {
 limits: {
 fileSize: 10 * 1024 * 1024, // 10 MB
 },
});

// ── JWT authenticate decorator ────────────────────────────────────────────────

fastify.decorate("authenticate", async (request: unknown, reply: unknown) => {
 // Simple JWT verification — handled by @fastify/jwt onRequest hook
 // This decorator just ensures the token is valid before proceeding
 try {
 await (request as { jwtVerify: () => Promise<void> }).jwtVerify();
 } catch {
 (reply as { code: (status: number) => { send: (body: { success: boolean; error: string }) => void } }).code(401).send({
 success: false,
 error: "Unauthorized",
 });
 }
});

// ── Routes ────────────────────────────────────────────────────────────────────

await authRoutes(fastify);
await agencyRoutes(fastify);
await clientRoutes(fastify);
await integrationRoutes(fastify);
await metricsRoutes(fastify);
await templateRoutes(fastify);
await reportRoutes(fastify);
await subscriptionRoutes(fastify);
await webhookRoutes(fastify);
await healthRoutes(fastify);

// ── Root ─────────────────────────────────────────────────────────────────────

fastify.get("/", async () => {
 return {
 name: "AgencyPulse API",
 version: "1.0.0",
 status: "ok",
 docs: "/api/docs", // Swagger — not yet wired up
 };
});

// ── Listen ───────────────────────────────────────────────────────────────────

const start = async () => {
 try {
 // Initialise BullMQ queues
 BullQueue.init();

 // Initialise Sentry
 initSentry(fastify);

 const port = parseInt(process.env.PORT ?? "3001", 10);

 await fastify.listen({ port, host: "0.0.0.0" });

 logger.info({ port, env: process.env.NODE_ENV }, "AgencyPulse API listening");
 } catch (err) {
 logger.error(err, "Failed to start server");
 process.exit(1);
 }
};

// ── Graceful shutdown ─────────────────────────────────────────────────────────

const gracefulShutdown = async (signal: string) => {
 logger.info({ signal }, "Shutting down gracefully");

 try {
 await fastify.close();
 logger.info("Fastify closed");
 process.exit(0);
 } catch (err) {
 logger.error(err, "Error during shutdown");
 process.exit(1);
 }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

start();
