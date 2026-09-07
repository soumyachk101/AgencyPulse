import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { IntegrationService } from "../services/integration.service";
import { Role, IntegrationProvider } from "@prisma/client";
import { sendSuccess, sendError } from "../lib/response";

const providerSchema = z.enum([
 "GOOGLE_ANALYTICS",
 "FACEBOOK_ADS",
 "GOOGLE_ADS",
 "HUBSPOT",
 "SHOPIFY",
]);

export async function integrationRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/clients/:id/integrations
 */
 fastify.get(
 "/clients/:id/integrations",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; role: Role };
 const { id: clientId } = request.params as { id: string };

 // Verify client belongs to agency
 const client = await prisma.client.findFirst({
 where: { id: clientId, agencyId: payload.agencyId },
 select: { id: true },
 });
 if (!client) {
 return sendError(reply, "Client not found", 404);
 }

 const integrations = await IntegrationService.listByClient(clientId);
 return sendSuccess(reply, integrations);
 } catch {
 return sendError(reply, "Failed to fetch integrations", 500);
 }
 }
 );

 /**
 * POST /api/clients/:id/integrations
 * Initiate OAuth flow for a provider.
 */
 fastify.post(
 "/clients/:id/integrations",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; userId: string };
 const { id: clientId } = request.params as { id: string };
 const { provider } = request.body as { provider: IntegrationProvider };

 if (!providerSchema.safeParse(provider).success) {
 return sendError(reply, "Invalid provider", 400);
 }

 // Verify client belongs to agency
 const client = await prisma.client.findFirst({
 where: { id: clientId, agencyId: payload.agencyId },
 select: { id: true },
 });
 if (!client) {
 return sendError(reply, "Client not found", 404);
 }

 const result = await IntegrationService.authorize(
 clientId,
 provider,
 payload.userId
 );

 return sendSuccess(reply, result);
 } catch (err) {
 return sendError(reply, err instanceof Error ? err.message : "Failed to authorize", 400);
 }
 }
 );

 /**
 * DELETE /api/clients/:id/integrations/:integrationId
 */
 fastify.delete(
 "/clients/:id/integrations/:integrationId",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id: clientId, integrationId } = request.params as {
 id: string;
 integrationId: string;
 };

 // Verify client belongs to agency
 const client = await prisma.client.findFirst({
 where: { id: clientId, agencyId: payload.agencyId },
 });
 if (!client) {
 return sendError(reply, "Client not found", 404);
 }

 await IntegrationService.remove(integrationId);
 return sendSuccess(reply, null, 200, "Integration removed");
 } catch (err) {
 return sendError(reply, err instanceof Error ? err.message : "Failed to remove integration", 500);
 }
 }
 );

 /**
 * POST /api/clients/:id/integrations/:integrationId/sync
 * Trigger manual sync.
 */
 fastify.post(
 "/clients/:id/integrations/:integrationId/sync",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id: clientId, integrationId } = request.params as {
 id: string;
 integrationId: string;
 };

 // Verify client belongs to agency
 const client = await prisma.client.findFirst({
 where: { id: clientId, agencyId: payload.agencyId },
 });
 if (!client) {
 return sendError(reply, "Client not found", 404);
 }

 const result = await IntegrationService.triggerSync(integrationId);
 return sendSuccess(reply, result, 202, "Sync started");
 } catch (err) {
 return sendError(reply, err instanceof Error ? err.message : "Failed to start sync", 500);
 }
 }
 );
}