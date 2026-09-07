export interface Template {
 id: string;
 organizationId?: string;
 name: string;
 description?: string;
 type: 'monthly' | 'quarterly' | 'annual' | 'custom';
 sections: ReportSection;
 isPublic: boolean;
 previewImageUrl?: string;
 usageCount: number;
 createdAt: Date;
 updatedAt: Date;
}
