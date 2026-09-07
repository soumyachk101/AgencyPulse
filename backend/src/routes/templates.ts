import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { TemplateService } from "../services/template.service";
import { Role } from "@prisma/client";
import { sendSuccess, sendPaginated } from "../lib/response";

const templateCreateSchema = z.object({
 name: z.string().min(1),
 description: z.string().optional(),
 sections: z.array(z.unknown()),
 styles: z.record(z.unknown()).optional(),
 isPublic: z.boolean().default(false),
 clientId: z.string().optional(),
});

const templateUpdateSchema = z.object({
 name: z.string().min(1).optional(),
 description: z.string().optional().nullable(),
 sections: z.array(z.unknown()).optional(),
 styles: z.record(z.unknown()).optional().nullable(),
 isPublic: z.boolean().optional(),
});

export async function templateRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/templates
 */
 fastify.get(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; role: Role };
 const { page = "1", limit = "20", clientId } = request.query as {
 page?: string;
 limit?: string;
 clientId?: string;
 };

 const pageNum = Math.max(1, parseInt(page, 10) || 1);
 const limitNum = Math.min(100, parseInt(limit, 10) || 20);
 const skip = (pageNum - 1) * limitNum;

 const result = await TemplateService.listTemplates({
 agencyId: payload.agencyId,
 clientId,
 isPublic: payload.role === "MEMBER" ? true : undefined,
 page: pageNum,
 limit: limitNum,
 });

 return sendPaginated(reply, result);
 } catch {
 return sendError(reply, "Failed to fetch templates", 500);
 }
 }
 );

 /**
 * POST /api/templates
 */
 fastify.post(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; userId: string };
 const body = templateCreateSchema.parse(request.body);

 const template = await TemplateService.create({
 ...body,
 agencyId: payload.agencyId,
 createdById: payload.userId,
 styles: body.styles ?? {},
 isPublic: body.isPublic ?? false,
 });

 return sendSuccess(reply, template, 201, "Template created");
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, "Failed to create template", 500);
 }
 }
 );

 /**
 * GET /api/templates/:id
 */
 fastify.get(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const template = await TemplateService.getById(id);
 if (!template || template.agencyId !== payload.agencyId) {
 return sendError(reply, "Template not found", 404);
 }

 return sendSuccess(reply, template);
 } catch {
 return sendError(reply, "Failed to fetch template", 500);
 }
 }
 );

 /**
 * PATCH /api/templates/:id
 */
 fastify.patch(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };
 const body = templateUpdateSchema.parse(request.body);

 const template = await TemplateService.getById(id);
 if (!template || template.agencyId !== payload.agencyId) {
 return sendError(reply, "Template not found", 404);
 }

 const updated = await TemplateService.update(id, body);
 return sendSuccess(reply, updated, 200, "Template updated");
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, "Failed to update template", 500);
 }
 }
 );

 /**
 * DELETE /api/templates/:id
 */
 fastify.delete(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const template = await TemplateService.getById(id);
 if (!template || template.agencyId !== payload.agencyId) {
 return sendError(reply, "Template not found", 404);
 }

 await TemplateService.delete(id);
 return sendSuccess(reply, null, 200, "Template deleted");
 } catch {
 return sendError(reply, "Failed to delete template", 500);
 }
 }
 );
}