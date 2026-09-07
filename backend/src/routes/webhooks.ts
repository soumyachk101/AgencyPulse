import { FastifyInstance } from "fastify";
import Stripe from "stripe";
import crypto from "crypto";
import { z } from "zod";
import { IntegrationService } from "../services/integration.service";
import { WebhookService } from "../services/webhook.service";
import { BullQueue } from "../queue/bull-queue";
import { BillingService } from "../services/billing.service";
import { sendSuccess, sendError } from "../lib/response";

const bullQueue = BullQueue.reportQueue;

function isPrivateUrl(url: string): boolean {
	try {
		const host = new URL(url).hostname;
		return (
			host === "localhost" ||
			host === "127.0.0.1" ||
			host.startsWith("10.") ||
			/^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
			host.startsWith("192.168.") ||
			host === "::1"
		);
	} catch {
		return true;
	}
}

export async function webhookRoutes(fastify: FastifyInstance) {
 /**
 * POST /api/webhooks/stripe
 * Stripe inbound webhook.
 */
 fastify.post<{ Body: unknown }>(
 "/stripe",
 async (request, reply) => {
 try {
 const rawBody = JSON.stringify(request.body);
 const signature = request.headers["stripe-signature"] as string;
 const secret = process.env.STRIPE_WEBHOOK_SECRET;

 if (!secret) {
 return sendError(reply, "Stripe webhook secret not configured", 500);
 }

 // Verify Stripe signature
 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 apiVersion: "2024-12-18.acacia",
 });

 let event: Stripe.Event;
 try {
 event = stripe.webhooks.constructEvent(
 rawBody,
 signature,
 secret
 );
 } catch (err) {
 return sendError(reply, "Invalid webhook signature", 400);
 }

 await BillingService.handleWebhookEvent(event);
 return sendSuccess(reply, { received: true });
 } catch (err) {
 return sendError(reply, "Webhook processing failed", 500);
 }
 }
 );

 /**
 * POST /api/webhooks/oauth/:provider
 * OAuth callback from integration providers.
 */
 fastify.post<{
 Params: { provider: string };
 Body: { code?: string; state?: string; error?: string };
 }>(
 "/oauth/:provider",
 async (request, reply) => {
 try {
 const { provider } = request.params as { provider: string };
 const { code, state, error } = request.body as {
 code?: string;
 state?: string;
 error?: string;
 };

 if (error) {
 return sendError(reply, `OAuth error: ${error}`, 400);
 }

 if (!code || !state) {
 return sendError(reply, "Missing code or state", 400);
 }

 const result = await IntegrationService.handleCallback(code, state);
 return sendSuccess(reply, result);
 } catch (err) {
 return sendError(reply, err instanceof Error ? err.message : "OAuth callback failed", 400);
 }
 }
 );

 /**
 * POST /api/webhooks/inbound
 * Generic inbound webhook endpoint for external systems.
 */
 fastify.post<{
 Body: { event: string; payload: Record<string, unknown> };
 }>(
 "/inbound",
 async (request, reply) => {
 try {
 const { event, payload } = request.body as {
 event: string;
 payload: Record<string, unknown>;
 };

 if (!event || !payload) {
 return sendError(reply, "Missing event or payload", 400);
 }

 // Queue for async processing
 await BullQueue.webhookQueue.add("inbound-webhook", {
 event,
 payload,
 receivedAt: new Date().toISOString(),
 });

 return sendSuccess(reply, { received: true });
 } catch {
 return sendError(reply, "Failed to process inbound webhook", 500);
 }
 }
 );

 /**
 * POST /api/webhooks/outbound
 * Register outbound webhook configuration.
 */
 fastify.post(
 "/outbound",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };

 const schema = z.object({
 url: z.string().url(),
 events: z.array(z.string()),
 secret: z.string().optional(),
 });

 const body = schema.parse(request.body);

 // Validate events
 const validEvents = [
 "report.created",
 "report.ready",
 "report.sent",
 "client.created",
 "client.updated",
 "integration.synced",
 "integration.error",
 ];

 const invalidEvents = body.events.filter((e) => !validEvents.includes(e));
 if (invalidEvents.length > 0) {
 return sendError(reply, `Invalid events: ${invalidEvents.join(", ")}`, 400);
 }

 await WebhookService.register(payload.agencyId, body);
 return sendSuccess(reply, null, 201, "Webhook registered");
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, "Failed to register webhook", 500);
 }
 }
 );
}