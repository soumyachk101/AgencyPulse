import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

export async function healthRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/health
 * Health check endpoint.
 */
 fastify.get("/health", async (_request, reply) => {
 const [dbHealthy, redisHealthy] = await Promise.all([
 prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
 redis.ping().then((r) => r === "PONG").catch(() => false),
 ]);

 const status = dbHealthy && redisHealthy ? "ok" : "degraded";
 const code = status === "ok" ? 200 : 503;

 return reply.status(code).send({
 success: status === "ok",
 status,
 services: {
 database: dbHealthy ? "healthy" : "unhealthy",
 redis: redisHealthy ? "healthy" : "unhealthy",
 },
 timestamp: new Date().toISOString(),
 uptime: process.uptime(),
 });
 });

 /**
 * GET /api/health/live
 * Simple liveness probe.
 */
 fastify.get("/health/live", async (_request, reply) => {
 return reply.send({ success: true, status: "live" });
 });

 /**
 * GET /api/health/ready
 * Readiness probe — checks all dependencies.
 */
 fastify.get("/health/ready", async (_request, reply) => {
 try {
 await Promise.all([
 prisma.$queryRaw`SELECT 1`,
 redis.ping(),
 ]);
 return reply.send({ success: true, status: "ready" });
 } catch (err) {
 return reply.status(503).send({
 success: false,
 status: "not_ready",
 error: err instanceof Error ? err.message : "Unknown",
 });
 }
 });
}
