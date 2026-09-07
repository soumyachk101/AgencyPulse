import { prisma } from "../lib/prisma";
import { ReportTemplate, Client, User } from "@prisma/client";

interface CreateTemplateInput {
 name: string;
 description?: string;
 agencyId: string;
 createdById: string;
 sections: Record<string, unknown>[];
 styles?: Record<string, unknown>;
 isPublic?: boolean;
 clientId?: string;
}

interface UpdateTemplateInput {
 name?: string;
 description?: string | null;
 sections?: Record<string, unknown>[];
 styles?: Record<string, unknown> | null;
 isPublic?: boolean;
}

export class TemplateService {
 static async create(input: CreateTemplateInput): Promise<ReportTemplate> {
 // Validate sections structure
 if (!Array.isArray(input.sections) || input.sections.length === 0) {
 throw new Error("Template must have at least one section");
 }

 return prisma.reportTemplate.create({
 data: {
 agencyId: input.agencyId,
 createdById: input.createdById,
 name: input.name,
 description: input.description,
 sections: input.sections,
 styles: input.styles ?? {},
 isPublic: input.isPublic ?? false,
 clientId: input.clientId ?? null,
 },
 include: {
 client: { select: { id: true, name: true } },
 createdBy: { select: { id: true, email: true, name: true } },
 },
 });
 }

 static async getById(templateId: string): Promise<ReportTemplate | null> {
 return prisma.reportTemplate.findUnique({
 where: { id: templateId },
 include: {
 client: { select: { id: true, name: true } },
 createdBy: { select: { id: true, email: true, name: true } },
 },
 });
 }

 static async listTemplates(filters: {
 agencyId: string;
 clientId?: string;
 isPublic?: boolean;
 page?: number;
 limit?: number;
 }): Promise<{ data: ReportTemplate[]; total: number }> {
 const { agencyId, clientId, isPublic, page = 1, limit = 20 } = filters;
 const skip = (page - 1) * limit;

 const where: Record<string, unknown> = { agencyId };
 if (clientId) where.clientId = clientId;
 if (isPublic !== undefined) where.isPublic = isPublic;

 const [data, total] = await Promise.all([
 prisma.reportTemplate.findMany({
 where,
 skip,
 take: limit,
 orderBy: { updatedAt: "desc" },
 include: {
 client: { select: { id: true, name: true } },
 createdBy: { select: { id: true, email: true, name: true } },
 },
 }),
 prisma.reportTemplate.count({ where }),
 ]);

 return { data, total };
 }

 static async update(templateId: string, input: UpdateTemplateInput): Promise<ReportTemplate> {
 const template = await prisma.reportTemplate.findUnique({
 where: { id: templateId },
 });

 if (!template) {
 throw new Error("Template not found");
 }

 return prisma.reportTemplate.update({
 where: { id: templateId },
 data: input,
 include: {
 client: { select: { id: true, name: true } },
 createdBy: { select: { id: true, email: true, name: true } },
 },
 });
 }

 static async delete(templateId: string): Promise<void> {
 await prisma.reportTemplate.delete({ where: { id: templateId } });
 }
}
