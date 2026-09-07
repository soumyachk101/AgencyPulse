-- AgencyPulse initial schema

-- Agencies
CREATE TABLE IF NOT EXISTS agencies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 white_label_enabled BOOLEAN DEFAULT false,
 logo_url TEXT,
 primary_color TEXT DEFAULT '#F43F5E',
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 email TEXT,
 company TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin')),
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 metrics JSONB DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE IF NOT EXISTS reports (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
 title TEXT NOT NULL,
 period_start DATE NOT NULL,
 period_end DATE NOT NULL,
 pdf_url TEXT,
 status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'sent')),
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals
CREATE TABLE IF NOT EXISTS approvals (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
 feedback TEXT,
 reviewed_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- White Label Configs
CREATE TABLE IF NOT EXISTS white_label_configs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id UUID NOT NULL UNIQUE REFERENCES agencies(id) ON DELETE CASCADE,
 logo_url TEXT,
 primary_color TEXT NOT NULL DEFAULT '#F43F5E',
 secondary_color TEXT,
 font_family TEXT,
 custom_domain TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_clients_agency ON clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_agency ON campaigns(agency_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_reports_agency ON reports(agency_id);
CREATE INDEX IF NOT EXISTS idx_reports_client ON reports(client_id);
CREATE INDEX IF NOT EXISTS idx_reports_campaign ON reports(campaign_id);
CREATE INDEX IF NOT EXISTS idx_approvals_report ON approvals(report_id);