import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { sendSuccess, sendPaginated } from "../lib/response";

const metricsQuerySchema = z.object({
 startDate: z.string().optional(),
 endDate: z.string().optional(),
 source: z.string().optional(),
 name: z.string().optional(),
 limit: z.coerce.number().max(500).default(100),
 offset: z.coerce.number().default(0),
});

export async function metricsRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/clients/:id/metrics
 */
 fastify.get(
 "/clients/:id/metrics",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id: clientId } = request.params as { id: string };
 const query = metricsQuerySchema.parse(request.query);

 // Verify client belongs to agency
 const client = await prisma.client.findFirst({
 where: { id: clientId, agencyId: payload.agencyId },
 select: { id: true },
 });
 if (!client) {
 return sendError(reply, "Client not found", 404);
 }

 const where: Record<string, unknown> = { clientId };
 if (query.startDate) {
 where = { ...where, date: { gte: new Date(query.startDate) } };
 }
 if (query.endDate) {
 where = { ...where, date: { ...(where.date as Record<string, Date> | undefined), lte: new Date(query.endDate) } };
 }
 if (query.source) where.source = query.source;
 if (query.name) where.name = { contains: query.name, mode: "insensitive" };

 const [data, total] = await Promise.all([
 prisma.metric.findMany({
 where,
 orderBy: { date: "desc" },
 take: Math.min(query.limit, 500),
 skip: query.offset,
 }),
 prisma.metric.count({ where }),
 ]);

 return sendPaginated(reply, {
 data,
 total,
 page: Math.floor(query.offset / query.limit) + 1,
 limit: query.limit,
 totalPages: Math.ceil(total / query.limit),
 });
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, "Failed to fetch metrics", 500);
 }
 }
 );
}