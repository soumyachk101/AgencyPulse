import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { ReportService } from "../services/report.service";
import { BillingService } from "../services/billing.service";
import { sendSuccess, sendPaginated, sendError } from "../lib/response";

const reportCreateSchema = z.object({
 title: z.string().min(1),
 clientId: z.string(),
 templateId: z.string(),
 description: z.string().optional(),
 sections: z.array(z.unknown()).optional(),
 sendEmail: z.boolean().default(false),
});

export async function reportRoutes(fastify: FastifyInstance) {
 /**
 * GET /api/reports
 */
 fastify.get(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { page = "1", limit = "20", clientId, status } = request.query as {
 page?: string;
 limit?: string;
 clientId?: string;
 status?: string;
 };
 const pageNum = Math.max(1, parseInt(page, 10) || 1);
 const limitNum = Math.min(100, parseInt(limit, 10) || 20);

 const { data, total } = await ReportService.listReports({
 agencyId: payload.agencyId,
 clientId,
 status,
 page: pageNum,
 limit: limitNum,
 });

 return sendPaginated(reply, {
 data,
 total,
 page: pageNum,
 limit: limitNum,
 totalPages: Math.ceil(total / limitNum),
 });
 } catch {
 return sendError(reply, "Failed to fetch reports", 500);
 }
 }
 );

 /**
 * POST /api/reports
 */
 fastify.post(
 "/",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string; userId: string };
 const body = reportCreateSchema.parse(request.body);

 // Verify client belongs to agency
 const client = await prisma.client.findFirst({
 where: { id: body.clientId, agencyId: payload.agencyId },
 select: { id: true },
 });
 if (!client) {
 return sendError(reply, "Client not found", 404);
 }

 // Verify template belongs to agency
 const template = await prisma.reportTemplate.findFirst({
 where: { id: body.templateId, agencyId: payload.agencyId },
 select: { id: true },
 });
 if (!template) {
 return sendError(reply, "Template not found", 404);
 }

 // Check plan limit
 const limitCheck = await BillingService.checkLimit(
 payload.agencyId,
 "reports"
 );
 if (!limitCheck.allowed) {
 return sendError(
 reply,
 `Report limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade your plan.`,
 403
 );
 }

 const report = await ReportService.createReport({
 ...body,
 agencyId: payload.agencyId,
 createdById: payload.userId,
 });

 return sendSuccess(reply, report, 201, "Report queued for generation");
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, "Failed to create report", 500);
 }
 }
 );

 /**
 * GET /api/reports/:id
 */
 fastify.get(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const report = await ReportService.getById(id);
 if (!report || report.agencyId !== payload.agencyId) {
 return sendError(reply, "Report not found", 404);
 }

 return sendSuccess(reply, report);
 } catch {
 return sendError(reply, "Failed to fetch report", 500);
 }
 }
 );

 /**
 * GET /api/reports/:id/pdf
 */
 fastify.get(
 "/:id/pdf",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const report = await ReportService.getById(id);
 if (!report || report.agencyId !== payload.agencyId) {
 return sendError(reply, "Report not found", 404);
 }

 if (report.status !== "READY" && report.status !== "SENT") {
 return sendError(reply, "Report not ready yet", 400);
 }

 // Regenerate PDF if needed
 const pdfBuffer = await ReportService.generatePdf({
 title: report.title,
 clientName: report.client.name,
 narrative: report.narrative ?? "",
 metrics: [],
 sections: report.sections as Array<Record<string, unknown>>,
 periodStart: new Date(report.createdAt).toISOString().split("T")[0],
 periodEnd: new Date(report.updatedAt).toISOString().split("T")[0],
 });

 reply.header("Content-Type", "application/pdf");
 reply.header(
 "Content-Disposition",
 `attachment; filename="report-${report.id}.pdf"`
 );
 return reply.send(pdfBuffer);
 } catch (err) {
 return sendError(reply, err instanceof Error ? err.message : "Failed to generate PDF", 500);
 }
 }
 );

 /**
 * POST /api/reports/:id/send
 */
 fastify.post(
 "/:id/send",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const report = await ReportService.getById(id);
 if (!report || report.agencyId !== payload.agencyId) {
 return sendError(reply, "Report not found", 404);
 }

 await ReportService.sendReportEmail(report, report.client, report);
 return sendSuccess(reply, null, 200, "Report sent");
 } catch (err) {
 return sendError(reply, err instanceof Error ? err.message : "Failed to send report", 500);
 }
 }
 );

 /**
 * DELETE /api/reports/:id
 */
 fastify.delete(
 "/:id",
 { onRequest: [fastify.authenticate] },
 async (request, reply) => {
 try {
 const payload = request.user as { agencyId: string };
 const { id } = request.params as { id: string };

 const report = await ReportService.getById(id);
 if (!report || report.agencyId !== payload.agencyId) {
 return sendError(reply, "Report not found", 404);
 }

 await ReportService.deleteReport(id);
 return sendSuccess(reply, null, 200, "Report deleted");
 } catch {
 return sendError(reply, "Failed to delete report", 500);
 }
 }
 );
}