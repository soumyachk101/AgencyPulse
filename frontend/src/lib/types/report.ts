export interface Report {
 id: string;
 clientId: string;
 organizationId: string;
 title: string;
 description?: string;
 type: 'monthly' | 'quarterly' | 'annual' | 'custom';
 status: 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
 sections: ReportSection[];
 data: Record<string, unknown>;
 narrative?: string;
 recommendations?: string[];
 scheduledAt?: Date;
 deliveredAt?: Date;
 createdBy: string;
 createdAt: Date;
 updatedAt: Date;
}

export interface ReportSection {
 id: string;
 name: string;
 type: 'kpi' | 'chart' | 'narrative' | 'table' | 'recommendation';
 config: SectionConfig;
 order: number;
 enabled: boolean;
}

export interface SectionConfig {
 metric?: string;
 chartType?: 'area' | 'line' | 'bar' | 'pie' | 'funnel' | 'horizontal-bar';
 dateRange?: DateRange;
 comparePeriod?: boolean;
 narrative?: string;
 columns?: string[];
}

export interface DateRange {
 start: Date;
 end: Date;
 compareStart?: Date;
 compareEnd?: Date;
}

export interface ReportTemplate {
 id: string;
 organizationId?: string;
 name: string;
 description?: string;
 type: 'monthly' | 'quarterly' | 'annual' | 'custom';
 sections: ReportSection[];
 isPublic: boolean;
 createdAt: Date;
 updatedAt: Date;
}
