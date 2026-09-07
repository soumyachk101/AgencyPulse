import fp from "fastify-plugin";

/**
 * Rate limiting configuration.
 *
 * Provides a route-level rate limiter that can be applied selectively.
 * Uses a sliding window strategy.
 */
export default fp(async (fastify) => {
 // @ts-expect-error - fastify-rate-limit types
 const rateLimit = await import("@fastify/rate-limit");

 await fastify.register(rateLimit.default, {
 global: false, // Apply per-route instead of globally
 max: 100, // 100 requests
 timeWindow: "1 minute",
 allowList: [], // Add IPs to bypass rate limiting
 skipOnError: true,
 keyGenerator: (request) => {
 // Rate-limit per user when authenticated, per IP otherwise
 const user = request.user as { userId?: string } | undefined;
 return user?.userId ?? request.ip;
 },
 redis: undefined, // Will use in-memory if Redis not configured
 });
});
