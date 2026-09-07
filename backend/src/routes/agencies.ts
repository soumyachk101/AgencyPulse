import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { sendSuccess, sendError } from "../lib/response";

const agencyUpdateSchema = z.object({
 name: z.string().min(1).optional(),
 metadata: z.record(z.unknown()).optional(),
});

export async function agencyRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/agencies/me
 * Get current user's agency.
 */
 fastify.get(
 "/me",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };

 const agency = await prisma.agency.findUnique({
 where: { id: payload.agencyId },
 select: {
 id: true,
 name: true,
 slug: true,
 createdAt: true,
 updatedAt: true,
 _count: {
 select: {
 clients: true,
 users: true,
 integrations: true,
 },
 },
 },
 });

 if (!agency) {
 return sendError(reply, "Agency not found", 404);
 }

 return sendSuccess(reply, agency);
 } catch {
 return sendError(reply, "Failed to fetch agency", 500);
 }
 }
 );

 /**
 * PATCH /api/agencies/me
 * Update current agency.
 */
 fastify.patch(
 "/me",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const body = agencyUpdateSchema.parse(request.body);

 const agency = await prisma.agency.update({
 where: { id: payload.agencyId },
 data: {
 name: body.name,
 metadata: body.metadata as Record<string, unknown>,
 },
 select: {
 id: true,
 name: true,
 slug: true,
 metadata: true,
 createdAt: true,
 updatedAt: true,
 },
 });

 return sendSuccess(reply, agency, 200, "Agency updated");
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400, err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "));
 }
 return sendError(reply, "Failed to update agency", 500);
 }
 }
 );
}
