import { prisma } from "../lib/prisma";
import { BullQueue } from "../queue/bull-queue";
import { DataSyncService } from "./data-sync.service";
import { ReportStatus } from "@prisma/client";
import { Report, User, Client } from "@prisma/client";

const reportQueue = BullQueue.reportQueue;

/**
 * Report service handles report creation, PDF generation, and delivery.
 */
export class ReportService {
 /**
 * Create a new report and optionally queue it for generation.
 */
 static async createReport(input: {
 title: string;
 agencyId: string;
 clientId: string;
 templateId: string;
 createdById: string;
 description?: string;
 sendEmail?: boolean;
 }): Promise<Report> {
 const template = await prisma.reportTemplate.findUnique({
 where: { id: input.templateId },
 });

 if (!template) {
 throw new Error("Report template not found");
 }

 const report = await prisma.report.create({
 data: {
 ...input,
 agencyId: input.agencyId,
 sections: template.sections,
 metadata: {},
 status: "DRAFT",
 sendEmail: input.sendEmail ?? false,
 },
 include: {
 client: true,
 template: true,
 createdBy: true,
 },
 });

 // Queue AI narrative + PDF generation
 await reportQueue.add("generate-report", {
 reportId: report.id,
 });

 return report;
 }

 /**
 * Generate AI narrative and PDF for a report.
 */
 static async generateReport(reportId: string): Promise<void> {
 const report = await prisma.report.update({
 where: { id: reportId },
 data: { status: "GENERATING", error: null },
 });

 try {
 const client = await prisma.client.findUnique({
 where: { id: report.clientId },
 });

 if (!client) {
 throw new Error("Client not found");
 }

 // Fetch recent metrics for narrative
 const endDate = new Date();
 const startDate = new Date();
 startDate.setDate(startDate.getDate() - 30);

 const metrics = await prisma.metric.findMany({
 where: {
 clientId: report.clientId,
 date: { gte: startDate, lte: endDate },
 },
 orderBy: { date: "desc" },
 take: 50,
 });

 const periodStart = startDate.toISOString().split("T")[0];
 const periodEnd = endDate.toISOString().split("T")[0];

 // Generate AI narrative
 const narrative = await DataSyncService.generateNarrative(
 client.name,
 periodStart,
 periodEnd,
 metrics.map((m) => m.id),
 report.description
 );

 // Generate PDF
 const pdfBuffer = await this.generatePdf({
 title: report.title,
 clientName: client.name,
 narrative,
 metrics,
 sections: (report.sections as Record<string, unknown>[]) ?? [],
 periodStart,
 periodEnd,
 });

 // Upload PDF (in production, upload to S3 / Vercel Blob)
 const pdfUrl = `https://storage.agencypulse.io/reports/${reportId}.pdf`;
 // For now we just store the placeholder

 const updated = await prisma.report.update({
 where: { id: reportId },
 data: {
 status: "READY",
 narrative,
 pdfUrl,
 sections: {
 ...(report.sections as Record<string, unknown>),
 metrics,
 narrative,
 },
 },
 });

 // Send email if requested
 if (report.sendEmail && client.email) {
 await this.sendReportEmail(report, client, updated);
 await prisma.report.update({
 where: { id: reportId },
 data: { emailSentAt: new Date(), status: "SENT" },
 });
 }
 } catch (error) {
 await prisma.report.update({
 where: { id: reportId },
 data: {
 status: "ERROR",
 error: error instanceof Error ? error.message : "Generation failed",
 },
 });
 throw error;
 }
 }

 /**
 * Generate a PDF from report data using pdf-lib.
 */
 static async generatePdf(input: {
 title: string;
 clientName: string;
 narrative: string;
 metrics: Array<{
 name: string;
 value: number;
 unit?: string | null;
 source: string;
 date: Date;
 }>;
 sections: unknown[];
 periodStart: string;
 periodEnd: string;
 }): Promise<Buffer> {
 const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
 const doc = await PDFDocument.create();
 const page = doc.addPage([612, 792]); // Letter size
 const font = await doc.embedFont(StandardFonts.Helvetica);

 // Title
 page.drawText(input.title, {
 x: 50,
 y: 700,
 size: 24,
 font,
 color: rgb(0.1, 0.1, 0.1),
 });

 // Client & period
 page.drawText(`Client: ${input.clientName}`, {
 x: 50,
 y: 665,
 size: 12,
 font,
 color: rgb(0.3, 0.3, 0.3),
 });
 page.drawText(`Period: ${input.periodStart} – ${input.periodEnd}`, {
 x: 50,
 y: 648,
 size: 12,
 font,
 color: rgb(0.3, 0.3, 0.3),
 });

 // Narrative
 const narrativeLines = input.narrative.split("\n");
 let y = 610;
 page.drawText("Narrative", { x: 50, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
 y -= 25;
 for (const line of narrativeLines) {
 if (y < 80) {
 const newPage = doc.addPage([612, 792]);
 y = 740;
 newPage.drawText(line, {
 x: 50,
 y,
 size: 10,
 font,
 color: rgb(0.2, 0.2, 0.2),
 });
 y -= 14;
 } else {
 page.drawText(line, {
 x: 50,
 y,
 size: 10,
 font,
 color: rgb(0.2, 0.2, 0.2),
 });
 y -= 14;
 }
 }

 // Metrics table
 y -= 15;
 page.drawText("Metrics Summary", {
 x: 50,
 y,
 size: 14,
 font,
 color: rgb(0.1, 0.1, 0.1),
 });
 y -= 20;

 const metricRows = input.metrics.slice(0, 20); // limit to 20 for the PDF
 for (const m of metricRows) {
 if (y < 80) break;
 page.drawText(
 `${m.source} | ${m.name}: ${m.value}${m.unit ? ` ${m.unit}` : ""} (${new Date(m.date).toLocaleDateString()})`,
 {
 x: 50,
 y,
 size: 9,
 font,
 color: rgb(0.15, 0.15, 0.15),
 }
 );
 y -= 13;
 }

 // Footer
 page.drawText("Generated by AgencyPulse", {
 x: 50,
 y: 30,
 size: 8,
 font,
 color: rgb(0.5, 0.5, 0.5),
 });

 return Buffer.from(await doc.save());
 }

 /**
 * Send a report via email using Resend.
 */
 static async sendReportEmail(
 report: Report,
 client: Client,
 fullReport: Report
 ): Promise<void> {
 if (!process.env.RESEND_API_KEY) {
 console.warn("RESEND_API_KEY not configured — skipping email");
 return;
 }

 const resend = (await import("resend")).Resend;
 const resendClient = new resend(process.env.RESEND_API_KEY);

 const subject = `Your ${report.title} is ready`;
 const html = `
 <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
 <h2>${report.title}</h2>
 <p>Hi,</p>
 <p>Your report for the period is now ready.</p>
 <p><strong>Summary:</strong></p>
 <p>${fullReport.narrative ?? "No narrative available."}</p>
 <p><a href="${report.pdfUrl}" style="background: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Download PDF</a></p>
 <p>Best regards,<br/>Your Agency Team</p>
 </div>
 `;

 await resendClient.emails.send({
 from: process.env.EMAIL_FROM ?? "reports@agencypulse.io",
 to: client.email,
 subject,
 html,
 });
 }

 /**
 * Get a report by ID.
 */
 static async getById(reportId: string): Promise<Report | null> {
 return prisma.report.findUnique({
 where: { id: reportId },
 include: { client: true, template: true, createdBy: true },
 });
 }

 /**
 * List reports with filters.
 */
 static async listReports(filters: {
 agencyId: string;
 clientId?: string;
 status?: string;
 page?: number;
 limit?: number;
 }): Promise<{ data: Report[]; total: number }> {
 const { agencyId, clientId, status, page = 1, limit = 20 } = filters;
 const skip = (page - 1) * limit;

 const where: Record<string, unknown> = { agencyId };
 if (clientId) where.clientId = clientId;
 if (status) where.status = status;

 const [data, total] = await Promise.all([
 prisma.report.findMany({
 where,
 skip,
 take: limit,
 orderBy: { createdAt: "desc" },
 include: { client: { select: { id: true, name: true, company: true } } },
 }),
 prisma.report.count({ where }),
 ]);

 return { data, total };
 }

 /**
 * Delete a report.
 */
 static async deleteReport(reportId: string): Promise<void> {
 await prisma.report.delete({ where: { id: reportId } });
 }
}
