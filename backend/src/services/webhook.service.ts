import { prisma } from "../lib/prisma";
import { BullQueue } from "../queue/bull-queue";

const webhookQueue = BullQueue.webhookQueue;

interface WebhookConfig {
 url: string;
 events: string[];
 secret?: string;
}

/**
 * Outbound webhook delivery service.
 */
export class WebhookService {
 /**
 * Register an outbound webhook for an agency.
 */
 static async register(agencyId: string, config: WebhookConfig): Promise<void> {
 // Store in a generic key-value store or dedicated webhook_configs table
 // For now, store as a JSON value on the agency
 await prisma.agency.update({
 where: { id: agencyId },
 data: {
 metadata: {
 ...(await prisma.agency.findUnique({
 where: { id: agencyId },
 select: { metadata: true },
 }).then((a) => a?.metadata as Record<string, unknown> | null)),
 webhooks: [config],
 },
 },
 });
 }

 /**
 * Send an event to all registered webhooks for the agency.
 */
 static async sendEvent(
 agencyId: string,
 event: string,
 payload: Record<string, unknown>
 ): Promise<void> {
 const agency = await prisma.agency.findUnique({
 where: { id: agencyId },
 select: { metadata: true },
 });

 const webhooks = (agency?.metadata as Record<string, unknown> | null)
 ?.webhooks as WebhookConfig[] | [];

 for (const webhook of webhooks) {
 if (!webhook.events.includes(event)) continue;

 await webhookQueue.add("deliver-webhook", {
 url: webhook.url,
 event,
 payload,
 secret: webhook.secret,
 });
 }
 }
}
