import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { BillingService } from "../services/billing.service";
import { Role } from "@prisma/client";
import { sendSuccess, sendError, sendPaginated } from "../lib/response";

// ── Schemas ───────────────────────────────────────────────────────────────────

const clientCreateSchema = z.object({
 name: z.string().min(1),
 email: z.string().email(),
 company: z.string().optional(),
 industry: z.string().optional(),
 metadata: z.record(z.unknown()).optional(),
});

const clientUpdateSchema = z.object({
 name: z.string().min(1).optional(),
 email: z.string().email().optional(),
 company: z.string().optional().nullable(),
 industry: z.string().optional().nullable(),
 status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
 metadata: z.record(z.unknown()).optional(),
});

export async function clientRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/clients
 * List all clients for the agency.
 */
 fastify.get(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; role: Role };
 const { page = "1", limit = "20", status, industry } = request.query as Record<
 string,
 string | undefined
 >;
 const pageNum = Math.max(1, parseInt(page, 10) || 1);
 const limitNum = Math.min(100, parseInt(limit, 10) || 20);
 const skip = (pageNum - 1) * limitNum;

 const where: Record<string, unknown> = { agencyId: payload.agencyId };
 if (status) where.status = status;
 if (industry) where.industry = industry;

 const [data, total] = await Promise.all([
 prisma.client.findMany({
 where,
 skip,
 take: limitNum,
 orderBy: { createdAt: "desc" },
 select: {
 id: true,
 name: true,
 email: true,
 company: true,
 industry: true,
 status: true,
 createdAt: true,
 updatedAt: true,
 _count: { select: { integrations: true, reports: true } },
 },
 }),
 prisma.client.count({ where }),
 ]);

 return sendPaginated(reply, {
 data,
 total,
 page: pageNum,
 limit: limitNum,
 totalPages: Math.ceil(total / limitNum),
 });
 } catch {
 return sendError(reply, "Failed to fetch clients", 500);
 }
 }
 );

 /**
 * POST /api/clients
 * Create a new client.
 */
 fastify.post(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; userId: string };
 const body = clientCreateSchema.parse(request.body);

 // Check plan limit
 const limitCheck = await BillingService.checkLimit(
 payload.agencyId,
 "clients"
 );
 if (!limitCheck.allowed) {
 return sendError(
 reply,
 `Client limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade your plan.`,
 403
 );
 }

 const client = await prisma.client.create({
 data: {
 agencyId: payload.agencyId,
 createdById: payload.userId,
 ...body,
 },
 });

 return sendSuccess(reply, client, 201, "Client created");
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400, err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "));
 }
 return sendError(reply, "Failed to create client", 500);
 }
 }
 );

 /**
 * GET /api/clients/:id
 */
 fastify.get(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const client = await prisma.client.findFirst({
 where: { id, agencyId: payload.agencyId },
 include: {
 integrations: true,
 _count: { select: { reports: true } },
 },
 });

 if (!client) {
 return sendError(reply, "Client not found", 404);
 }

 return sendSuccess(reply, client);
 } catch {
 return sendError(reply, "Failed to fetch client", 500);
 }
 }
 );

 /**
 * PATCH /api/clients/:id
 */
 fastify.patch(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };
 const body = clientUpdateSchema.parse(request.body);

 const existing = await prisma.client.findFirst({
 where: { id, agencyId: payload.agencyId },
 });
 if (!existing) {
 return sendError(reply, "Client not found", 404);
 }

 const client = await prisma.client.update({
 where: { id },
 data: body,
 });

 return sendSuccess(reply, client, 200, "Client updated");
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, "Failed to update client", 500);
 }
 }
 );

 /**
 * DELETE /api/clients/:id
 */
 fastify.delete(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const existing = await prisma.client.findFirst({
 where: { id, agencyId: payload.agencyId },
 });
 if (!existing) {
 return sendError(reply, "Client not found", 404);
 }

 await prisma.client.delete({ where: { id } });
 return sendSuccess(reply, null, 200, "Client deleted");
 } catch {
 return sendError(reply, "Failed to delete client", 500);
 }
 }
 );
}