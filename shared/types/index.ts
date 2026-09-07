export interface Agency {
 id: string;
 name: string;
 white_label_enabled: boolean;
 logo_url?: string;
 primary_color?: string;
 created_at: string;
}

export interface Client {
 id: string;
 agency_id: string;
 name: string;
 email?: string;
 company?: string;
 created_at: string;
}

export interface Campaign {
 id: string;
 agency_id: string;
 client_id: string;
 name: string;
 platform: "facebook" | "instagram" | "twitter" | "linkedin";
 start_date: string;
 end_date: string;
 metrics: Record<string, any>;
 created_at: string;
}

export interface Report {
 id: string;
 agency_id: string;
 client_id: string;
 campaign_id: string;
 title: string;
 period_start: string;
 period_end: string;
 pdf_url?: string;
 status: "draft" | "pending_approval" | "approved" | "sent";
 created_at: string;
}

export interface Approval {
 id: string;
 report_id: string;
 client_id: string;
 status: "pending" | "approved" | "rejected";
 feedback?: string;
 reviewed_at?: string;
 created_at: string;
}

export interface WhiteLabelConfig {
 id: string;
 agency_id: string;
 logo_url?: string;
 primary_color: string;
 secondary_color?: string;
 font_family?: string;
 custom_domain?: string;
 created_at: string;
 updated_at: string;
}
