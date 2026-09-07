import { prisma } from "../lib/prisma";
import { BullQueue } from "../queue/bull-queue";
import { ReportService } from "../services/report.service";
import { DataSyncService } from "../services/data-sync.service";
import { WebhookService } from "../services/webhook.service";
import { logger } from "../monitoring/logger";

BullQueue.init();

/**
 * Scheduled job runner.
 *
 * This module is intended to be invoked by a cron scheduler
 * (e.g. `node-cron`, a system cron, or a task queue worker).
 */

export class Scheduler {
 /**
 * Runs all scheduled reports that are due.
 */
 static async runScheduledReports(): Promise<void> {
 const now = new Date();

 const dueReports = await prisma.scheduledReport.findMany({
 where: { isActive: true, nextRunAt: { lte: now } },
 include: { template: true },
 });

 logger.info({ count: dueReports.length }, "Running due scheduled reports");

 for (const scheduled of dueReports) {
 try {
 const report = await ReportService.createReport({
 title: scheduled.name,
 agencyId: scheduled.agencyId,
 clientId: scheduled.clientId ?? scheduled.template.clientId ?? "",
 templateId: scheduled.templateId,
 createdById: scheduled.agencyId, // placeholder, needs a real userId
 sendEmail: true,
 });

 // Update next run
 const nextRun = this.calculateNextRun(scheduled.frequency, scheduled.cronExpression);
 await prisma.scheduledReport.update({
 where: { id: scheduled.id },
 data: {
 lastRunAt: new Date(),
 nextRunAt: nextRun,
 },
 });

 logger.info(
 { scheduledReportId: scheduled.id, reportId: report.id },
 "Scheduled report created"
 );
 } catch (err) {
 logger.error(
 { scheduledReportId: scheduled.id, error: err },
 "Failed to run scheduled report"
 );
 }
 }
 }

 /**
 * Runs periodic sync for all clients with active integrations.
 */
 static async runPeriodicSync(): Promise<void> {
 const agencies = await prisma.agency.findMany({
 select: { id: true },
 });

 for (const agency of agencies) {
 const clients = await prisma.client.findMany({
 where: { agencyId: agency.id },
 select: { id: true },
 });

 for (const client of clients) {
 try {
 await DataSyncService.syncClient(client.id);
 } catch (err) {
 logger.error({ agencyId: agency.id, clientId: client.id, error: err }, "Periodic sync failed");
 }
 }
 }
 }

 /**
 * Calculate next run time based on frequency.
 */
 private static calculateNextRun(
 frequency: string,
 cronExpression?: string
 ): Date {
 const now = new Date();
 const next = new Date(now);

 switch (frequency) {
 case "daily":
 next.setDate(next.getDate() + 1);
 next.setHours(8, 0, 0, 0);
 break;
 case "weekly":
 next.setDate(next.getDate() + 7);
 next.setHours(8, 0, 0, 0);
 break;
 case "monthly":
 next.setMonth(next.getMonth() + 1);
 next.setDate(1);
 next.setHours(8, 0, 0, 0);
 break;
 case "quarterly":
 next.setMonth(next.getMonth() + 3);
 next.setDate(1);
 next.setHours(8, 0, 0, 0);
 break;
 default:
 if (cronExpression) {
 // Simple cron parsing — for production, use a library like cron-parser
 next.setHours(next.getHours() + 24);
 }
 break;
 }

 return next;
 }
}
