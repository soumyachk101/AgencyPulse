# AgencyPulse — PostgreSQL Database Schema

## Conventions

- All timestamps use `timestamptz`.
- All monetary values use `numeric(12,2)`.
- UUIDs are generated with `gen_random_uuid()`.
- `created_at` / `updated_at` follow the `created_at DEFAULT now()` / `updated_at DEFAULT now()` pattern and are maintained by triggers.

---

## Extension Setup

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

---

## Table Definitions

### 1. agencies

Top-level tenant. Every other row belongs to one agency.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | `gen_random_uuid()` |
| name | varchar(255) NOT NULL | |
| slug | varchar(100) UNIQUE NOT NULL | URL-safe identifier |
| api_key | varchar(255) UNIQUE NOT NULL | Hashed API key |
| settings | jsonb DEFAULT '{}' | Branding, defaults |
| plan | varchar(50) DEFAULT 'free' | free, pro, enterprise |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

```sql
CREATE TABLE agencies (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name varchar(255) NOT NULL,
 slug varchar(100) UNIQUE NOT NULL,
 api_key varchar(255) UNIQUE NOT NULL,
 settings jsonb DEFAULT '{}',
 plan varchar(50) DEFAULT 'free',
 created_at timestamptz DEFAULT now(),
 updated_at timestamptz DEFAULT now()
);
```

---

### 2. clients

An agency's end-clients — the businesses receiving reports.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | |
| agency_id | uuid REFERENCES agencies(id) ON DELETE CASCADE | |
| name | varchar(255) NOT NULL | |
| industry | varchar(100) | |
| website | varchar(500) | |
| contact_email | varchar(255) | |
| contact_name | varchar(255) | |
| settings | jsonb DEFAULT '{}' | Client-specific overrides |
| is_active | boolean DEFAULT true | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

```sql
CREATE TABLE clients (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 name varchar(255) NOT NULL,
 industry varchar(100),
 website varchar(500),
 contact_email varchar(255),
 contact_name varchar(255),
 settings jsonb DEFAULT '{}',
 is_active boolean DEFAULT true,
 created_at timestamptz DEFAULT now(),
 updated_at timestamptz DEFAULT now()
);
```

---

### 3. integrations

Connects external marketing tools (Google Analytics, Facebook Ads, Google Ads, HubSpot, Shopify, etc.) to a client.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | |
| client_id | uuid REFERENCES clients(id) ON DELETE CASCADE | |
| platform | varchar(50) NOT NULL | google_analytics, facebook, google_ads, hubspot, shopify, custom |
| name | varchar(255) NOT NULL | User-facing label |
| credentials | jsonb NOT NULL | Encrypted access/refresh tokens |
| status | varchar(50) DEFAULT 'active' | active, error, expired |
| last_synced_at | timestamptz | |
| error_message | text | |
| metadata | jsonb DEFAULT '{}' | Account IDs, property IDs, etc. |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

```sql
CREATE TABLE integrations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 platform varchar(50) NOT NULL CHECK (platform IN (
 'google_analytics','facebook','google_ads','hubspot','shopify','custom')),
 name varchar(255) NOT NULL,
 credentials jsonb NOT NULL,
 status varchar(50) DEFAULT 'active',
 last_synced_at timestamptz,
 error_message text,
 metadata jsonb DEFAULT '{}',
 created_at timestamptz DEFAULT now(),
 updated_at timestamptz DEFAULT now()
);
```

---

### 4. metrics

Time-series data fetched from integrations. Each row is one metric observation for one client/platform.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | |
| client_id | uuid REFERENCES clients(id) ON DELETE CASCADE | |
| integration_id | uuid REFERENCES integrations(id) ON DELETE CASCADE | |
| metric_type | varchar(100) NOT NULL | e.g. sessions, impressions, spend |
| metric_value | numeric(14,4) NOT NULL | |
| dimensions | jsonb DEFAULT '{}' | e.g. {"campaign": "..."} |
| period_start | date NOT NULL | Start of the aggregation window |
| period_end | date NOT NULL | End of the aggregation window |
| created_at | timestamptz DEFAULT now() | |

```sql
CREATE TABLE metrics (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE,
 metric_type varchar(100) NOT NULL,
 metric_value numeric(14,4) NOT NULL,
 dimensions jsonb DEFAULT '{}',
 period_start date NOT NULL,
 period_end date NOT NULL,
 created_at timestamptz DEFAULT now()
);
```

---

### 5. report_templates

Reusable report layouts owned by an agency.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | |
| agency_id | uuid REFERENCES agencies(id) ON DELETE CASCADE | |
| name | varchar(255) NOT NULL | |
| description | text | |
| sections | jsonb NOT NULL | Ordered list of sections |
| style_config | jsonb DEFAULT '{}' | Colors, fonts, logos |
| is_default | boolean DEFAULT false | |
| created_by | uuid | References users(id) if added later|
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

```sql
CREATE TABLE report_templates (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 name varchar(255) NOT NULL,
 description text,
 sections jsonb NOT NULL,
 style_config jsonb DEFAULT '{}',
 is_default boolean DEFAULT false,
 created_by uuid,
 created_at timestamptz DEFAULT now(),
 updated_at timestamptz DEFAULT now()
);
```

`sections` example:
```json
[
 {
 "id": "executive_summary",
 "title": "Executive Summary",
 "order": 1,
 "enabled": true,
 "config": {
 "include_narrative": true,
 "include_highlight": true
 }
 },
 {
 "id": "platform_breakdown",
 "title": "Platform Performance",
 "order": 2,
 "enabled": true,
 "platforms": ["google_analytics", "facebook", "google_ads"],
 "metrics": ["sessions", "impressions", "spend", "roas"]
 }
]
```

---

### 6. reports

A generated report instance for a specific client and period.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | |
| agency_id | uuid REFERENCES agencies(id) ON DELETE CASCADE | |
| client_id | uuid REFERENCES clients(id) ON DELETE CASCADE | |
| template_id | uuid REFERENCES report_templates(id) | nullable — ad-hoc reports |
| title | varchar(500) NOT NULL | Overrides template name |
| status | varchar(50) DEFAULT 'draft' | draft, generating, completed, failed, sent |
| period_start | date NOT NULL | |
| period_end | date NOT NULL | |
| sections | jsonb DEFAULT '[]' | Snapshot of enabled sections |
| style_config | jsonb DEFAULT '{}' | Snapshot of styling |
| narrative | text | AI-generated narrative |
| metrics_snapshot | jsonb DEFAULT '{}' | Cached metric values at generation time |
| pdf_url | varchar | S3 / storage path |
| pdf_size_kb | integer | |
| created_by | uuid | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |
| sent_at | timestamptz | |

```sql
CREATE TABLE reports (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 template_id uuid REFERENCES report_templates(id),
 title varchar(500) NOT NULL,
 status varchar(50) DEFAULT 'draft',
 period_start date NOT NULL,
 period_end date NOT NULL,
 sections jsonb DEFAULT '[]',
 style_config jsonb DEFAULT '{}',
 narrative text,
 metrics_snapshot jsonb DEFAULT '{}',
 pdf_url varchar,
 pdf_size_kb integer,
 created_by uuid,
 created_at timestamptz DEFAULT now(),
 updated_at timestamptz DEFAULT now(),
 sent_at timestamptz
);
```

---

### 7. subscriptions

Defines how often a report is generated and for which client.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | |
| agency_id | uuid REFERENCES agencies(id) ON DELETE CASCADE | |
| client_id | uuid REFERENCES clients(id) ON DELETE CASCADE | |
| template_id | uuid REFERENCES report_templates(id) | |
| name | varchar(255) NOT NULL | e.g. "Monthly Facebook Report" |
| frequency | varchar(50) NOT NULL | weekly, monthly, quarterly, custom |
| frequency_days | integer | Used when frequency = custom |
| day_of_week | integer | 1=Mon … 7=Sun, for weekly |
| day_of_month | integer | 1-31, for monthly |
| month_offset | integer DEFAULT 0 | For quarterly: 0, 3, 6, 9 |
| period_days | integer DEFAULT 30 | Lookback window |
| recipients | jsonb DEFAULT '[]' | [{"email": "...", "name": "..."}] |
| is_active | boolean DEFAULT true | |
| last_run_at | timestamptz | |
| next_run_at | timestamptz | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

```sql
CREATE TABLE subscriptions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
 client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
 template_id uuid REFERENCES report_templates(id),
 name varchar(255) NOT NULL,
 frequency varchar(50) NOT NULL,
 frequency_days integer,
 day_of_week integer CHECK (day_of_week BETWEEN 1 AND 7),
 day_of_month integer CHECK (day_of_month BETWEEN 1 AND 31),
 month_offset integer DEFAULT 0,
 period_days integer DEFAULT 30,
 recipients jsonb DEFAULT '[]',
 is_active boolean DEFAULT true,
 last_run_at timestamptz,
 next_run_at timestamptz,
 created_at timestamptz DEFAULT now(),
 updated_at timestamptz DEFAULT now()
);
```

---

### 8. scheduled_reports

Execution log for each subscription run. One row per attempt.

| Column | Type | Notes |
|----------------|--------------------------|------------------------------------|
| id | uuid PRIMARY KEY | |
| subscription_id| uuid REFERENCES subscriptions(id) ON DELETE CASCADE | |
| report_id | uuid REFERENCES reports(id) ON DELETE SET NULL | |
| status | varchar(50) DEFAULT 'pending' | pending, running, completed, failed |
| triggered_at | timestamptz DEFAULT now()| Cron trigger time |
| started_at | timestamptz | |
| finished_at | timestamptz | |
| error_message | text | |
| error_stack | text | |
| created_at | timestamptz DEFAULT now() | |

```sql
CREATE TABLE scheduled_reports (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
 report_id uuid REFERENCES reports(id) ON DELETE SET NULL,
 status varchar(50) DEFAULT 'pending',
 triggered_at timestamptz DEFAULT now(),
 started_at timestamptz,
 finished_at timestamptz,
 error_message text,
 error_stack text,
 created_at timestamptz DEFAULT now()
);
```

---

## Indexes

```sql
-- Agency lookups
CREATE UNIQUE INDEX idx_agencies_slug ON agencies(slug);
CREATE UNIQUE INDEX idx_agencies_api_key ON agencies(api_key);

-- Client list per agency
CREATE INDEX idx_clients_agency_id ON clients(agency_id);

-- Integration list per client
CREATE INDEX idx_integrations_client_id ON integrations(client_id);
CREATE INDEX idx_integrations_platform ON integrations(platform);

-- Metrics: range queries are the hot path
CREATE INDEX idx_metrics_client_period ON metrics(client_id, period_start, period_end);
CREATE INDEX idx_metrics_integration ON metrics(integration_id);
CREATE INDEX idx_metrics_type ON metrics(metric_type);

-- Trigram search on metric_type for autocomplete
CREATE INDEX idx_metrics_type_trgm ON metrics USING gin(metric_type gin_trgm_ops);

-- Reports: list by agency + status
CREATE INDEX idx_reports_agency_client ON reports(agency_id, client_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);

-- Subscriptions: find due
CREATE INDEX idx_subscriptions_next_run ON subscriptions(next_run_at) WHERE is_active = true;
CREATE INDEX idx_subscriptions_agency ON subscriptions(agency_id);

-- Scheduled reports: log queries
CREATE INDEX idx_scheduled_subscription ON scheduled_reports(subscription_id);
CREATE INDEX idx_scheduled_status ON scheduled_reports(status);
CREATE INDEX idx_scheduled_triggered ON scheduled_reports(triggered_at);
```

---

## Row Level Security (RLS)

```sql
-- Enable RLS on every table
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
```

### Agencies — every authenticated user can read their own agency

```sql
CREATE POLICY agency_auth ON agencies
 FOR ALL
 TO authenticated
 USING (id = (
 SELECT agency_id FROM agency_users
 WHERE user_id = auth.uid()
 ));
```

### Clients — agency-scoped

```sql
CREATE POLICY client_isolation ON clients
 FOR ALL
 TO authenticated
 USING (agency_id = (
 SELECT agency_id FROM agency_users
 WHERE user_id = auth.uid()
 ));
```

### Integrations — client-scoped

```sql
CREATE POLICY integration_isolation ON integrations
 FOR ALL
 TO authenticated
 USING (client_id IN (
 SELECT c.id FROM clients c
 JOIN agency_users au ON au.agency_id = c.agency_id
 WHERE au.user_id = auth.uid()
 ));
```

### Metrics — client-scoped read-only

```sql
CREATE POLICY metric_read_isolation ON metrics
 FOR SELECT
 TO authenticated
 USING (client_id IN (
 SELECT c.id FROM clients c
 JOIN agency_users au ON au.agency_id = c.agency_id
 WHERE au.user_id = auth.uid()
 ));

CREATE POLICY metric_write_service ON metrics
 FOR INSERT
 TO service_role
 WITH CHECK (true);
```

### Report templates — agency-scoped

```sql
CREATE POLICY template_isolation ON report_templates
 FOR ALL
 TO authenticated
 USING (agency_id = (
 SELECT agency_id FROM agency_users
 WHERE user_id = auth.uid()
 ));
```

### Reports — agency-scoped

```sql
CREATE POLICY report_isolation ON reports
 FOR ALL
 TO authenticated
 USING (agency_id = (
 SELECT agency_id FROM agency_users
 WHERE user_id = auth.uid()
 ));
```

### Subscriptions — agency-scoped

```sql
CREATE POLICY subscription_isolation ON subscriptions
 FOR ALL
 TO authenticated
 USING (agency_id = (
 SELECT agency_id FROM agency_users
 WHERE user_id = auth.uid()
 ));
```

### Scheduled reports — subscription-scoped (derives agency from subscription)

```sql
CREATE POLICY scheduled_report_isolation ON scheduled_reports
 FOR ALL
 TO authenticated
 USING (subscription_id IN (
 SELECT s.id FROM subscriptions s
 JOIN agency_users au ON au.agency_id = s.agency_id
 WHERE au.user_id = auth.uid()
 ));
```

---

## Updated-at Trigger (shared)

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = now();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agencies_updated BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_integrations_updated BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_templates_updated BEFORE UPDATE ON report_templates FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reports_updated BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## Seed Data

```sql
-- ── Agency ─────────────────────────────────────────────────────────────
INSERT INTO agencies (id, name, slug, api_key, settings, plan) VALUES (
 '00000000-0000-0000-0000-000000000001',
 'BrightPath Digital',
 'brightpath',
 crypt('brightpath-dev-key', gen_salt('bf')),
 '{"logo_url": "https://cdn.example.com/brightpath.png", "brand_color": "#2563eb"}',
 'pro'
);

-- ── Clients ────────────────────────────────────────────────────────────
INSERT INTO clients (id, agency_id, name, industry, website, contact_email, contact_name) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Aurora Skincare', 'Beauty & Cosmetics', 'https://auroraskincare.com', 'hello@auroraskincare.com', 'Sarah Chen'),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'PeakFit Gym', 'Fitness & Wellness', 'https://peakfitgym.com', 'info@peakfitgym.com', 'Marcus Rivera'),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'CloudVault SaaS', 'Technology / B2B SaaS', 'https://cloudvault.io', 'team@cloudvault.io', 'Priya Kapoor');

-- ── Integrations ────────────────────────────────────────────────────────
INSERT INTO integrations (id, client_id, platform, name, credentials, status, metadata) VALUES
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'google_analytics', 'Aurora GA4',
 '{"property_id": "G-ABC123"}', 'active', '{"property_id": "G-ABC123", "property_name": "auroraskincare.com"}'),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'facebook', 'Aurora Facebook Ads',
 '{"ad_account_id": "act_789"}', 'active', '{"ad_account_id": "act_789"}'),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 'google_ads', 'PeakFit Google Ads',
 '{"customer_id": "1234567890"}', 'active', '{"customer_id": "1234567890"}'),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000103', 'google_analytics', 'CloudVault GA4',
 '{"property_id": "G-XYZ789"}', 'active', '{"property_id": "G-XYZ789"}'),
('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000103', 'hubspot', 'CloudVault HubSpot CRM',
 '{"portal_id": "5555555"}', 'active', '{"portal_id": "5555555"}');

-- ── Sample Metrics (last 4 weeks for Aurora GA4) ────────────────────────
INSERT INTO metrics (client_id, integration_id, metric_type, metric_value, dimensions, period_start, period_end)
SELECT
 '00000000-0000-0000-0000-000000000101'::uuid,
 '00000000-0000-0000-0000-000000000201'::uuid,
 'sessions',
 50000 + (random() * 10000)::numeric(14,4),
 '{}'::jsonb,
 d,
 d + INTERVAL '6 days'
FROM generate_series(
 CURRENT_DATE - INTERVAL '27 days',
 CURRENT_DATE - INTERVAL '7 days',
 '7 days'
) AS t(d);

INSERT INTO metrics (client_id, integration_id, metric_type, metric_value, dimensions, period_start, period_end)
SELECT
 '00000000-0000-0000-0000-000000000101'::uuid,
 '00000000-0000-0000-0000-000000000201'::uuid,
 'conversions',
 250 + (random() * 100)::numeric(14,4),
 '{}'::jsonb,
 d,
 d + INTERVAL '6 days'
FROM generate_series(
 CURRENT_DATE - INTERVAL '27 days',
 CURRENT_DATE - INTERVAL '7 days',
 '7 days'
) AS t(d);

INSERT INTO metrics (client_id, integration_id, metric_type, metric_value, dimensions, period_start, period_end)
SELECT
 '00000000-0000-0000-0000-000000000101'::uuid,
 '00000000-0000-0000-0000-000000000202'::uuid,
 'spend',
 3000 + (random() * 1500)::numeric(14,4),
 '{}'::jsonb,
 d,
 d + INTERVAL '6 days'
FROM generate_series(
 CURRENT_DATE - INTERVAL '27 days',
 CURRENT_DATE - INTERVAL '7 days',
 '7 days'
) AS t(d);

INSERT INTO metrics (client_id, integration_id, metric_type, metric_value, dimensions, period_start, period_end)
SELECT
 '00000000-0000-0000-0000-000000000102'::uuid,
 '00000000-0000-0000-0000-000000000203'::uuid,
 'impressions',
 200000 + (random() * 50000)::numeric(14,4),
 '{}'::jsonb,
 d,
 d + INTERVAL '6 days'
FROM generate_series(
 CURRENT_DATE - INTERVAL '27 days',
 CURRENT_DATE - INTERVAL '7 days',
 '7 days'
) AS t(d);

INSERT INTO metrics (client_id, integration_id, metric_type, metric_value, dimensions, period_start, period_end)
SELECT
 '00000000-0000-0000-0000-000000000103'::uuid,
 '00000000-0000-0000-0000-000000000204'::uuid,
 'sessions',
 12000 + (random() * 3000)::numeric(14,4),
 '{}'::jsonb,
 d,
 d + INTERVAL '6 days'
FROM generate_series(
 CURRENT_DATE - INTERVAL '27 days',
 CURRENT_DATE - INTERVAL '7 days',
 '7 days'
) AS t(d);

-- ── Report Template ──────────────────────────────────────────────────────
INSERT INTO report_templates (id, agency_id, name, description, sections, style_config, is_default)
VALUES (
 '00000000-0000-0000-0000-000000000301',
 '00000000-0000-0000-0000-000000000001',
 'Standard Monthly Report',
 'Default client report covering overview, platform breakdown, and recommendations.',
 '[
 {
 "id": "executive_summary",
 "title": "Executive Summary",
 "order": 1,
 "enabled": true,
 "config": {"include_narrative": true, "include_highlight": true}
 },
 {
 "id": "platform_breakdown",
 "title": "Platform Performance",
 "order": 2,
 "enabled": true,
 "platforms": ["google_analytics", "facebook", "google_ads"],
 "metrics": ["sessions", "impressions", "spend", "roas"]
 },
 {
 "id": "trends",
 "title": "Trends & Insights",
 "order": 3,
 "enabled": true,
 "config": {"show_charts": true, "periods": 2}
 },
 {
 "id": "recommendations",
 "title": "Recommendations",
 "order": 4,
 "enabled": true
 }
 ]'::jsonb,
 '{"primary_color": "#2563eb", "font_family": "Inter", "logo_url": "https://cdn.example.com/brightpath.png"}',
 true
);

-- ── Reports ──────────────────────────────────────────────────────────────
INSERT INTO reports (id, agency_id, client_id, template_id, title, status, period_start, period_end, narrative, pdf_url) VALUES
('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101',
 '00000000-0000-0000-0000-000000000301', 'Aurora Skincare — August 2026 Report', 'completed',
 '2026-08-01', '2026-08-31',
 'August was a strong month for Aurora Skincare. Website sessions grew 12% week-over-week, driven by an effective Instagram Reels campaign. Facebook ad spend returned a ROAS of 4.8x. Recommendation: scale the top-performing ad sets and test new creative for the back-to-school push.',
 'https://cdn.example.com/reports/aurora-august-2026.pdf'),
('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102',
 '00000000-0000-0000-0000-000000000301', 'PeakFit Gym — August 2026 Report', 'completed',
 '2026-08-01', '2026-08-31',
 'PeakFit maintained steady impression volume throughout August. CPC rose 8% due to increased competition. Recommendation: expand into YouTube Shorts video ads and refresh landing page copy.',
 'https://cdn.example.com/reports/peakfit-august-2026.pdf');

-- ── Subscription ─────────────────────────────────────────────────────────
INSERT INTO subscriptions (id, agency_id, client_id, template_id, name, frequency, day_of_month, period_days, recipients, next_run_at)
VALUES (
 '00000000-0000-0000-0000-000000000501',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000101',
 '00000000-0000-0000-0000-000000000301',
 'Aurora Skincare — Monthly',
 'monthly',
 1,
 30,
 '[{"email": "hello@auroraskincare.com", "name": "Sarah Chen"}, {"email": "team@brightpath.com", "name": "BrightPath Team"}]',
 '2026-10-01 09:00:00+00'
);

-- ── Scheduled Report Log ────────────────────────────────────────────────
INSERT INTO scheduled_reports (id, subscription_id, report_id, status, triggered_at, finished_at)
VALUES (
 '00000000-0000-0000-0000-000000000601',
 '00000000-0000-0000-0000-000000000501',
 '00000000-0000-0000-0000-000000000401',
 'completed',
 '2026-09-01 09:00:00+00',
 '2026-09-01 09:02:14+00'
);
```

---

## Future Migration Notes

- Add a `users` table + `agency_users` join table when multi-user support is needed.
- Store integration `credentials` encrypted (e.g., using Supabase Vault or an external KMS).
- Partition `metrics` by `period_start` quarter for very large datasets.
- Add `webhooks` table (id, agency_id, url, secret, events, is_active) when outbound webhooks are implemented.
