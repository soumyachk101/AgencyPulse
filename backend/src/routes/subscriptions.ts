import { FastifyInstance } from "fastify";
import { Role, PlanId } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { BillingService } from "../services/billing.service";
import { PLANS } from "../lib/plans";
import { sendSuccess, sendPaginated, sendError } from "../lib/response";

function isSafeRedirect(url: string): boolean {
	try {
		const parsed = new URL(url);
		const allowed = new URL(process.env.APP_URL ?? "http://localhost:3000");
		return parsed.protocol === "https:" && parsed.hostname === allowed.hostname;
	} catch {
		return false;
	}
}

const createSchema = z.object({
 plan: z.enum(["STARTER", "GROWTH", "AGENCY", "ENTERPRISE"]),
 successUrl: z.string().url().refine(isSafeRedirect, "Invalid success URL"),
 cancelUrl: z.string().url().refine(isSafeRedirect, "Invalid cancel URL"),
});

export async function subscriptionRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/subscriptions
 */
 fastify.get(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };

 const subscription = await BillingService.getByAgency(payload.agencyId);
 return sendSuccess(reply, subscription);
 } catch {
 return sendError(reply, "Failed to fetch subscription", 500);
 }
 }
 );

 /**
 * POST /api/subscriptions
 */
 fastify.post(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const body = createSchema.parse(request.body);

 const { sessionId } = await BillingService.createCheckoutSession(
 payload.agencyId,
 PLANS[body.plan]?.priceId ?? "",
 body.successUrl,
 body.cancelUrl
 );

 return sendSuccess(reply, { sessionId }, 201);
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, err instanceof Error ? err.message : "Failed to create checkout", 400);
 }
 }
 );

 /**
 * PATCH /api/subscriptions/:id/cancel
 */
 fastify.patch(
 "/:id/cancel",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const { id } = request.params as { id: string };

 await BillingService.cancelSubscription(id);
 return sendSuccess(reply, null, 200, "Subscription will cancel at period end");
 } catch {
 return sendError(reply, "Failed to cancel subscription", 500);
 }
 }
 );

 /**
 * PATCH /api/subscriptions/:id/resume
 */
 fastify.patch(
 "/:id/resume",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const { id } = request.params as { id: string };

 await BillingService.resumeSubscription(id);
 return sendSuccess(reply, null, 200, "Subscription resumed");
 } catch {
 return sendError(reply, "Failed to resume subscription", 500);
 }
 }
 );

 /**
 * DELETE /api/subscriptions/:id
 */
 fastify.delete(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; role: Role };
 if (payload.role !== "OWNER") {
 return sendError(reply, "Only owner can delete subscriptions", 403);
 }

 await prisma.subscription.deleteMany({
 where: { agencyId: payload.agencyId },
 });
 return sendSuccess(reply, null, 200, "Subscription deleted");
 } catch {
 return sendError(reply, "Failed to delete subscription", 500);
 }
 }
 );
}