# AgencyPulse — Database Schema (PostgreSQL)

## Overview

This document defines the complete PostgreSQL schema for AgencyPulse, including all tables, relationships, indexes, Row Level Security (RLS) policies, and seed data.

---

## 1. Table Definitions

### 1.1 `agencies`

The top-level tenant. Each agency owns clients, reports, templates, and subscriptions.

```sql
CREATE TABLE agencies (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE,
 plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise')),
 white_label_config JSONB DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

 -- soft-delete friendly
 deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE agencies IS 'Agency tenants – the root entity in the multi-tenant hierarchy.';
COMMENT ON COLUMN agencies.white_label_config IS '{"logo_url": "...", "primary_color": "#...", "custom_domain": "..."}';
```

### 1.2 `clients`

Clients belong to one agency.

```sql
CREATE TABLE clients (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 company TEXT NOT NULL,
 contact_person TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 deleted_at TIMESTAMPTZ,

 UNIQUE (agency_id, email)
);

CREATE INDEX idx_clients_agency_id ON clients(agency_id);
```

### 1.3 `integrations`

One row per platform integration per client. A client may have multiple rows (one per platform).

```sql
CREATE TABLE integrations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'ga4', 'linkedin', 'tiktok')),
 access_token TEXT NOT NULL,
 refresh_token TEXT,
 status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
 connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 last_synced_at TIMESTAMPTZ,
 error_message TEXT,
 expires_at TIMESTAMPTZ,

 UNIQUE (client_id, platform)
);

CREATE INDEX idx_integrations_client_id ON integrations(client_id);
CREATE INDEX idx_integrations_status ON integrations(status) WHERE deleted_at IS NULL;
```

### 1.4 `reports`

Generated reports. Each report is scoped to one client and one agency.

```sql
CREATE TABLE reports (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 report_type TEXT NOT NULL DEFAULT 'monthly' CHECK (report_type IN ('weekly', 'monthly', 'quarterly', 'custom')),
 period_start DATE NOT NULL,
 period_end DATE NOT NULL,
 data JSONB DEFAULT '{}'::jsonb,
 pdf_url TEXT,
 narrative_text TEXT,
 status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'sent', 'failed')),
 sent_at TIMESTAMPTZ,
 sent_to TEXT[] DEFAULT '{}',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 created_by UUID REFERENCES agencies(id),

 CONSTRAINT valid_period CHECK (period_end >= period_start)
);

CREATE INDEX idx_reports_client_id ON reports(client_id);
CREATE INDEX idx_reports_agency_id ON reports(agency_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);
```

### 1.5 `metrics`

Time-series performance data pulled from integrations.

```sql
CREATE TABLE metrics (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta', 'ga4', 'linkedin', 'tiktok')),
 metric_name TEXT NOT NULL, -- e.g. 'impressions', 'clicks', 'conversions', 'revenue', 'spend'
 value NUMERIC(18,4) NOT NULL,
 date DATE NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

 UNIQUE (client_id, platform, metric_name, date)
);

CREATE INDEX idx_metrics_client_date ON metrics(client_id, date DESC);
CREATE INDEX idx_metrics_platform_date ON metrics(platform, date DESC);
CREATE INDEX idx_metrics_metric_name ON metrics(metric_name);
```

### 1.6 `report_templates`

Reusable report structure definitions owned by an agency.

```sql
CREATE TABLE report_templates (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 description TEXT,
 sections JSONB NOT NULL DEFAULT '[]'::jsonb,
 branding JSONB DEFAULT '{}'::jsonb,
 is_default BOOLEAN NOT NULL DEFAULT false,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_report_templates_agency_id ON report_templates(agency_id);
```

**`sections` JSONB structure:**

```json
[
 {
 "id": "exec_summary",
 "title": "Executive Summary",
 "order": 1,
 "visible": true,
 "metrics": ["spend", "impressions", "clicks", "conversions"],
 "narrative_prompt": "Summarize the overall performance..."
 },
 {
 "id": "platform_breakdown",
 "title": "Platform Breakdown",
 "order": 2,
 "visible": true,
 "platforms": ["google_ads", "meta"],
 "charts": ["bar", "line"]
 }
]
```

**`branding` JSONB structure:**

```json
{
 "logo_url": "https://cdn.agencypulse.com/logos/agency-123.png",
 "primary_color": "#1a73e8",
 "secondary_color": "#34a853",
 "font_family": "Inter",
 "footer_text": "Prepared by AgencyPulse"
}
```

### 1.7 `subscriptions`

Billing record per agency.

```sql
CREATE TABLE subscriptions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 plan TEXT NOT NULL CHECK (plan IN ('starter', 'growth', 'enterprise')),
 status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete')),
 current_period_start TIMESTAMPTZ NOT NULL,
 current_period_end TIMESTAMPTZ NOT NULL,
 cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
 stripe_customer_id TEXT UNIQUE,
 stripe_subscription_id TEXT UNIQUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_agency_id ON subscriptions(agency_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 1.8 `scheduled_reports`

Automated report generation schedule.

```sql
CREATE TABLE scheduled_reports (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly')),
 day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday (for weekly)
 day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 31), -- for monthly/quarterly
 next_run_at TIMESTAMPTZ NOT NULL,
 last_run_at TIMESTAMPTZ,
 status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
 error_message TEXT,
 recipient_emails TEXT[] DEFAULT '{}',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run_at) WHERE status = 'active';
CREATE INDEX idx_scheduled_reports_client_id ON scheduled_reports(client_id);
```

---

## 2. Row Level Security (RLS)

All multi-tenant tables enforce row-level isolation. Policies ensure agencies can only access their own data.

### 2.1 Enable RLS

```sql
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
```

### 2.2 Agency Policies

```sql
-- Agencies: users see their own agency row
CREATE POLICY agency_self ON agencies
 FOR ALL
 TO authenticated
 USING (id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Clients: filter by the user's agency
CREATE POLICY clients_by_agency ON clients
 FOR ALL
 TO authenticated
 USING (agency_id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Integrations: scoped via clients belonging to the agency
CREATE POLICY integrations_by_agency ON integrations
 FOR ALL
 TO authenticated
 USING (
 client_id IN (
 SELECT id FROM clients WHERE agency_id = (SELECT agency_id FROM users WHERE id = auth.uid())
 )
 );

-- Reports: scoped by agency_id
CREATE POLICY reports_by_agency ON reports
 FOR ALL
 TO authenticated
 USING (agency_id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Metrics: scoped via clients belonging to the agency
CREATE POLICY metrics_by_agency ON metrics
 FOR ALL
 TO authenticated
 USING (
 client_id IN (
 SELECT id FROM clients WHERE agency_id = (SELECT agency_id FROM users WHERE id = auth.uid())
 )
 );

-- Report Templates: scoped by agency
CREATE POLICY templates_by_agency ON report_templates
 FOR ALL
 TO authenticated
 USING (agency_id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Subscriptions: scoped by agency
CREATE POLICY subscriptions_by_agency ON subscriptions
 FOR ALL
 TO authenticated
 USING (agency_id = (SELECT agency_id FROM users WHERE id = auth.uid()));

-- Scheduled Reports: scoped via clients belonging to the agency
CREATE POLICY scheduled_reports_by_agency ON scheduled_reports
 FOR ALL
 TO authenticated
 USING (
 client_id IN (
 SELECT id FROM clients WHERE agency_id = (SELECT agency_id FROM users WHERE id = auth.uid())
 )
 );
```

> **Note:** The `users` table referenced above is managed by Supabase Auth. The `agency_id` column is set on the user profile row during signup.

---

## 3. Indexes (Full List)

```sql
-- clients
CREATE INDEX idx_clients_agency_id ON clients(agency_id);

-- integrations
CREATE INDEX idx_integrations_client_id ON integrations(client_id);
CREATE INDEX idx_integrations_status ON integrations(status) WHERE deleted_at IS NULL;

-- reports
CREATE INDEX idx_reports_client_id ON reports(client_id);
CREATE INDEX idx_reports_agency_id ON reports(agency_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at_desc ON reports(created_at DESC);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);
CREATE INDEX idx_reports_agency_period ON reports(agency_id, period_start DESC);

-- metrics (composite for common queries)
CREATE INDEX idx_metrics_client_date ON metrics(client_id, date DESC);
CREATE INDEX idx_metrics_platform_date ON metrics(platform, date DESC);
CREATE INDEX idx_metrics_metric_name ON metrics(metric_name);

-- report_templates
CREATE INDEX idx_report_templates_agency_id ON report_templates(agency_id);

-- subscriptions
CREATE INDEX idx_subscriptions_agency_id ON subscriptions(agency_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- scheduled_reports
CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run_at) WHERE status = 'active';
CREATE INDEX idx_scheduled_reports_client_id ON scheduled_reports(client_id);
```

---

## 4. Seed Data (Sample)

```sql
-- ── Agencies ──────────────────────────────────────────────
INSERT INTO agencies (id, name, email, plan, white_label_config) VALUES
(
 'a1111111-1111-1111-1111-111111111111',
 'BrightWave Media',
 'hello@brightwave.agency',
 'growth',
 '{"logo_url":"https://cdn.agencypulse.com/logos/bw.png","primary_color":"#6C5CE7","custom_domain":"reports.brightwave.agency"}'::jsonb
),
(
 'a2222222-2222-2222-2222-222222222222',
 'NorthStar Digital',
 'team@northstar.agency',
 'enterprise',
 '{"logo_url":"https://cdn.agencypulse.com/logos/ns.png","primary_color":"#0984E3","custom_domain":"reports.northstar.agency"}'::jsonb
);

-- ── Clients ───────────────────────────────────────────────
INSERT INTO clients (id, agency_id, name, email, company, contact_person) VALUES
-- BrightWave clients
('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Acme Corp', 'marketing@acme.com', 'Acme Corporation', 'Jane Doe'),
('c2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'Globex', 'ads@globex.io', 'Globex Industries', 'John Smith'),
-- NorthStar clients
('c3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'Initech', 'cm@initech.com', 'Initech Solutions', 'Peter Gibbons'),
('c4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', 'Umbrella', 'finance@umbrella.co', 'Umbrella Corporation', 'Alice Wong');

-- ── Integrations ──────────────────────────────────────────
INSERT INTO integrations (id, client_id, platform, access_token, refresh_token, status, connected_at, expires_at) VALUES
-- Acme Corp integrations
('i1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'google_ads', 'ya29.encrypted_1', '1//encrypted_refresh_1', 'active', now(), now() + INTERVAL '1 hour'),
('i2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'meta', 'EAAJ_encrypted_2', 'EAAJ_encrypted_refresh_2', 'active', now(), now() + INTERVAL '60 days'),
('i3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'ga4', 'ya29.encrypted_3', '1//encrypted_refresh_3', 'active', now(), now() + INTERVAL '1 hour'),
-- Globex integrations
('i4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'google_ads', 'ya29.encrypted_4', '1//encrypted_refresh_4', 'active', now(), now() + INTERVAL '1 hour'),
-- Initech integrations
('i5555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333', 'linkedin', 'AQX_encrypted_5', 'AQX_encrypted_refresh_5', 'active', now(), now() + INTERVAL '60 days'),
('i6666666-6666-6666-6666-666666666666', 'c3333333-3333-3333-3333-333333333333', 'tiktok', 'act_encrypted_6', 'act_encrypted_refresh_6', 'active', now(), now() + INTERVAL '60 days');

-- ── Metrics (sample time-series data) ─────────────────────
INSERT INTO metrics (client_id, platform, metric_name, value, date) VALUES
-- Acme Corp – Google Ads (last 30 days)
('c1111111-1111-1111-1111-111111111111', 'google_ads', 'impressions', 45230, '2026-08-01'),
('c1111111-1111-1111-1111-1111-111111111111', 'google_ads', 'clicks', 1820, '2026-08-01'),
('c1111111-1111-1111-1111-1111-111111111111', 'google_ads', 'conversions', 87, '2026-08-01'),
('c1111111-1111-1111-1111-1111-111111111111', 'google_ads', 'spend', 4250.50, '2026-08-01'),
('c1111111-1111-1111-1111-1111-111111111111', 'google_ads', 'impressions', 51200, '2026-08-02'),
('c1111111-1111-1111-1111-1111-111111111111', 'google_ads', 'clicks', 2100, '2026-08-02'),
('c1111111-1111-1111-1111-1111-111111111111', 'google_ads', 'conversions', 102, '2026-08-02'),
('c1111111-1111-1111-1111-1111-111111111111', 'google_ads', 'spend', 4890.00, '2026-08-02'),
-- Acme Corp – Meta
('c1111111-1111-1111-1111-111111111111', 'meta', 'impressions', 128000, '2026-08-01'),
('c1111111-1111-1111-1111-1111-111111111111', 'meta', 'clicks', 5400, '2026-08-01'),
('c1111111-1111-1111-1111-1111-111111111111', 'meta', 'conversions', 245, '2026-08-01'),
('c1111111-1111-1111-1111-1111-111111111111', 'meta', 'spend', 6100.75, '2026-08-01'),
-- Initech – LinkedIn
('c3333333-3333-3333-3333-333333333333', 'linkedin', 'impressions', 89000, '2026-08-01'),
('c3333333-3333-3333-3333-333333333333', 'linkedin', 'clicks', 2100, '2026-08-01'),
('c3333333-3333-3333-3333-333333333333', 'linkedin', 'conversions', 56, '2026-08-01'),
('c3333333-3333-3333-3333-333333333333', 'linkedin', 'spend', 3200.00,'2026-08-01'),
-- Initech – TikTok
('c3333333-3333-3333-3333-333333333333', 'tiktok', 'impressions', 250000, '2026-08-01'),
('c3333333-3333-3333-3333-333333333333', 'tiktok', 'clicks', 7800, '2026-08-01'),
('c3333333-3333-3333-3333-333333333333', 'tiktok', 'conversions', 190, '2026-08-01'),
('c3333333-3333-3333-3333-333333333333', 'tiktok', 'spend', 5500.25,'2026-08-01');

-- ── Report Templates ──────────────────────────────────────
INSERT INTO report_templates (id, agency_id, name, description, sections, branding, is_default) VALUES
(
 't1111111-1111-1111-1111-111111111111',
 'a1111111-1111-1111-1111-111111111111',
 'Monthly Performance',
 'Standard monthly performance report with all key metrics.',
 '[
 {"id":"exec_summary","title":"Executive Summary","order":1,"visible":true,"metrics":["spend","impressions","clicks","conversions"],"narrative_prompt":"Provide an executive summary of this month performance."},
 {"id":"platform_breakdown","title":"Platform Breakdown","order":2,"visible":true,"platforms":["google_ads","meta","ga4"],"charts":["bar","line"]},
 {"id":"key_insights","title":"Key Insights & Recommendations","order":3,"visible":true,"narrative_prompt":"Highlight the top 3 insights and provide actionable recommendations."}
 ]'::jsonb,
 '{"logo_url":"https://cdn.agencypulse.com/logos/bw.png","primary_color":"#6C5CE7","font_family":"Inter"}'::jsonb,
 true
),
(
 't2222222-2222-2222-2222-222222222222',
 'a2222222-2222-2222-2222-222222222222',
 'B2B Lead Generation',
 'Focused on lead gen metrics across LinkedIn and Meta.',
 '[
 {"id":"exec_summary","title":"Executive Summary","order":1,"visible":true,"metrics":["spend","conversions","cpl"],"narrative_prompt":"Summarize lead generation performance."},
 {"id":"platform_breakdown","title":"Platform Breakdown","order":2,"visible":true,"platforms":["linkedin","meta"],"charts":["bar"]},
 {"id":"funnel","title":"Conversion Funnel","order":3,"visible":true,"metrics":["impressions","clicks","conversions"]}
 ]'::jsonb,
 '{"logo_url":"https://cdn.agencypulse.com/logos/ns.png","primary_color":"#0984E3","font_family":"Inter"}'::jsonb,
 true
);

-- ── Subscriptions ─────────────────────────────────────────
INSERT INTO subscriptions (agency_id, plan, status, current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id) VALUES
('a1111111-1111-1111-1111-111111111111', 'growth', 'active', '2026-08-01', '2026-09-01', 'cus_BW001', 'sub_BW001'),
('a2222222-2222-2222-2222-222222222222', 'enterprise','active', '2026-08-15', '2026-09-15', 'cus_NS001', 'sub_NS001');

-- ── Scheduled Reports ─────────────────────────────────────
INSERT INTO scheduled_reports (client_id, frequency, day_of_month, next_run_at, last_run_at, status, recipient_emails) VALUES
('c1111111-1111-1111-1111-111111111111', 'monthly', 1, '2026-10-01 08:00:00+00', '2026-09-01 08:00:00+00', 'active', ARRAY['jane@brightwave.agency', 'marketing@acme.com']),
('c2222222-2222-2222-2222-222222222222', 'monthly', 1, '2026-10-01 08:00:00+00', '2026-09-01 08:00:00+00', 'active', ARRAY['jane@brightwave.agency', 'ads@globex.io']),
('c3333333-3333-3333-3333-333333333333', 'weekly', NULL, '2026-09-07 08:00:00+00', '2026-08-31 08:00:00+00', 'active', ARRAY['team@northstar.agency', 'cm@initech.com']);

-- ── Reports (sample generated reports) ────────────────────
INSERT INTO reports (id, client_id, agency_id, report_type, period_start, period_end, data, status, sent_at) VALUES
(
 'r1111111-1111-1111-1111-111111111111',
 'c1111111-1111-1111-1111-111111111111',
 'a1111111-1111-1111-1111-111111111111',
 'monthly',
 '2026-08-01', '2026-08-31',
 '{
 "summary": {"total_spend": 15141.30, "total_impressions": 504430, "total_clicks": 9320, "total_conversions": 434},
 "platforms": {
 "google_ads": {"spend": 9140.50, "impressions": 96430, "clicks": 3920, "conversions": 189},
 "meta": {"spend": 6000.75, "impressions": 128000, "clicks": 5400, "conversions": 245}
 }
 }'::jsonb,
 'sent',
 '2026-09-01 09:15:00+00'
),
(
 'r2222222-2222-2222-2222-222222222222',
 'c3333333-3333-3333-3333-333333333333',
 'a2222222-2222-2222-2222-222222222222',
 'monthly',
 '2026-08-01', '2026-08-31',
 '{
 "summary": {"total_spend": 8700.25, "total_impressions": 339000, "total_clicks": 9900, "total_conversions": 246},
 "platforms": {
 "linkedin": {"spend": 3200.00, "impressions": 89000, "clicks": 2100, "conversions": 56},
 "tiktok": {"spend": 5500.25, "impressions": 250000, "clicks": 7800, "conversions": 190}
 }
 }'::jsonb,
 'sent',
 '2026-09-01 10:00:00+00'
);
```

---

## 5. Database Functions & Triggers

### 5.1 Auto-update `updated_at`

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = now();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_report_templates_updated_at
 BEFORE UPDATE ON report_templates
 FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
 BEFORE UPDATE ON subscriptions
 FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_scheduled_reports_updated_at
 BEFORE UPDATE ON scheduled_reports
 FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 5.2 Update `last_synced_at` on metrics insert

```sql
CREATE OR REPLACE FUNCTION touch_integration_sync()
RETURNS TRIGGER AS $$
BEGIN
 UPDATE integrations
 SET last_synced_at = now()
 WHERE id = (SELECT integration_id FROM metric_sync_jobs WHERE metric_id = NEW.id);
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. ER Diagram (Textual)

```
agencies (1) ──< (N) clients
agencies (1) ──< (N) report_templates
agencies (1) ──< (N) subscriptions
agencies (1) ──< (N) reports
clients (1) ──< (N) integrations
clients (1) ──< (N) reports
clients (1) ──< (N) metrics
clients (1) ──< (N) scheduled_reports
reports (1) ──< (N) metrics (aggregated into report.data JSONB)
```

---

## 7. Data Retention Policy

| Table | Retention | Notes |
|--------------------|-----------------------|----------------------------------------|
| `metrics` | 24 months | Archive to cold storage after 24 months|
| `reports` | Indefinite (agency) | Soft-delete after agency cancellation |
| `integrations` | Indefinite | Revoked tokens marked `revoked` status |
| `scheduled_reports`| Indefinite (agency) | Soft-delete with agency |
