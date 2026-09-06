# AgencyPulse — REST API Specification

**Base URL:** `https://api.agencypulse.io/v1`
**Auth:** Bearer token in `Authorization: header`. Tokens are per-user (see `users` table in future migrations) and scoped to an agency. All responses use ISO-8601 timestamps.

---

## Common Response Shape

```jsonc
// Success
{
 "data": { ... },
 "meta": { "request_id": "uuid", "timestamp": "..." }
}

// Error
{
 "error": {
 "code": "VALIDATION_ERROR",
 "message": "human-readable description",
 "details": [ ... ] // optional
 }
}
```

---

## 1. Agencies

### 1.1 Get current agency

```http
GET /agencies/me
```

**Response (200)**
```jsonc
{
 "data": {
 "id": "uuid",
 "name": "BrightPath Digital",
 "slug": "brightpath",
 "plan": "pro",
 "settings": {
 "logo_url": "https://cdn.example.com/brightpath.png",
 "brand_color": "#2563eb"
 },
 "created_at": "2026-01-15T10:00:00Z"
 }
}
```

---

## 2. Clients

### 2.1 List clients

```http
GET /clients?page=1&limit=20&search=aurora&industry=beauty&is_active=true
```

| Query | Type | Default | Notes |
|----------|--------|---------|---------------|
| page | int | 1 | |
| limit | int | 20 | Max 100 |
| search | string | — | Full-text on name |
| industry | string | — | Exact match filter |
| is_active | bool | — | |

**Response (200)**
```jsonc
{
 "data": [
 {
 "id": "uuid",
 "agency_id": "uuid",
 "name": "Aurora Skincare",
 "industry": "Beauty & Cosmetics",
 "website": "https://auroraskincare.com",
 "contact_email": "hello@auroraskincare.com",
 "contact_name": "Sarah Chen",
 "settings": {},
 "is_active": true,
 "created_at": "2026-01-20T08:30:00Z",
 "updated_at": "2026-03-10T14:22:00Z"
 }
 ],
 "meta": {
 "page": 1,
 "limit": 20,
 "total": 3,
 "has_more": false
 }
}
```

### 2.2 Create client

```http
POST /clients
Content-Type: application/json

{
 "name": "New Client",
 "industry": "Retail",
 "website": "https://example.com",
 "contact_email": "contact@example.com",
 "contact_name": "Jane Doe",
 "settings": {
 "reporting_timezone": "America/New_York"
 }
}
```

**Response (201)**

Same body as a client resource.

### 2.3 Get client

```http
GET /clients/:id
```

**Response (200)** — single client resource.

### 2.4 Update client

```http
PATCH /clients/:id
Content-Type: application/json

{ "is_active": false }
```

**Response (200)** — updated client resource.

### 2.5 Delete client

```http
DELETE /clients/:id
```

**Response (204)** No Content. Cascades to integrations, metrics, reports, subscriptions.

---

## 3. Integrations

### 3.1 List integrations

```http
GET /clients/:clientId/integrations
```

**Response (200)**
```jsonc
{
 "data": [
 {
 "id": "uuid",
 "client_id": "uuid",
 "platform": "google_analytics",
 "name": "Aurora GA4",
 "status": "active",
 "last_synced_at": "2026-09-05T14:00:00Z",
 "metadata": {
 "property_id": "G-ABC123",
 "property_name": "auroraskincare.com"
 },
 "created_at": "2026-02-01T09:00:00Z"
 }
 ]
}
```

### 3.2 Create integration

```http
POST /clients/:clientId/integrations
Content-Type: application/json

{
 "platform": "google_analytics",
 "name": "Aurora GA4 — New Property",
 "credentials": {
 "property_id": "G-NEW123"
 },
 "metadata": {
 "property_name": "new.auroraskincare.com"
 }
}
```

**Response (201)** — integration resource.

### 3.3 Trigger sync

```http
POST /clients/:clientId/integrations/:id/sync
```

Initiates an async background job to pull data. Returns a job ID.

**Response (202)**
```jsonc
{
 "data": {
 "job_id": "uuid",
 "status": "queued",
 "platform": "google_analytics",
 "client_id": "uuid"
 }
}
```

### 3.4 Delete integration

```http
DELETE /clients/:clientId/integrations/:id
```

**Response (204)** Cascades to metrics.

---

## 4. Metrics

### 4.1 Query metrics

```http
GET /clients/:clientId/metrics?start=2026-08-01&end=2026-08-31&metric_type=sessions&integration_id=uuid&granularity=weekly
```

| Query | Type | Notes |
|----------|--------|------|
| start | date (required) | ISO-8601 date |
| end | date (required) | ISO-8601 date |
| metric_type | string | Filter; comma-separated allowed |
| integration_id | uuid | Filter |
| granularity | string | daily, weekly, monthly |

**Response (200)**
```jsonc
{
 "data": [
 {
 "metric_type": "sessions",
 "integration_id": "uuid",
 "integration_platform": "google_analytics",
 "period_start": "2026-08-04",
 "period_end": "2026-08-10",
 "metric_value": 51234.0000,
 "dimensions": {},
 "previous_value": 45700.0000,
 "change_pct": 12.17
 }
 ],
 "meta": {
 "client_id": "uuid",
 "start": "2026-08-01",
 "end": "2026-08-31",
 "granularity": "weekly"
 }
}
```

---

## 5. Report Templates

### 5.1 List templates

```http
GET /templates?is_default=true
```

**Response (200)** — array of template resources.

```jsonc
{
 "data": [
 {
 "id": "uuid",
 "agency_id": "uuid",
 "name": "Standard Monthly Report",
 "description": "Default client report...",
 "sections": [ /* see DATABASE_SCHEMA.md */ ],
 "style_config": {
 "primary_color": "#2563eb",
 "font_family": "Inter"
 },
 "is_default": true,
 "created_at": "2026-01-20T09:00:00Z",
 "updated_at": "2026-03-10T14:22:00Z"
 }
 ]
}
```

### 5.2 Create template

```http
POST /templates
Content-Type: application/json

{
 "name": "E-Commerce Focused Report",
 "description": "Heavier on revenue and conversion metrics.",
 "sections": [ ... ],
 "style_config": { "primary_color": "#7c3aed" }
}
```

**Response (201)** — template resource.

### 5.3 Get template

```http
GET /templates/:id
```

**Response (200)** — template resource.

### 5.4 Update template

```http
PATCH /templates/:id
Content-Type: application/json

{ "is_default": true }
```

**Response (200)** — updated template resource.

### 5.5 Delete template

```http
DELETE /templates/:id
```

**Response (204**

Only allowed if no reports or subscriptions reference the template.

---

## 6. Reports

### 6.1 List reports

```http
GET /reports?client_id=uuid&status=completed&period_start=2026-08-01&period_end=2026-08-31&page=1&limit=20
```

| Query | Type | Notes |
|----------|--------|------|
| client_id | uuid | Filter |
| status | string | draft, generating, completed, failed, sent |
| period_start | date | Filter |
| period_end | date | Filter |
| page | int | |
| limit | int | |

**Response (200)**
```jsonc
{
 "data": [
 {
 "id": "uuid",
 "agency_id": "uuid",
 "client_id": "uuid",
 "template_id": "uuid",
 "title": "Aurora Skincare — August 2026 Report",
 "status": "completed",
 "period_start": "2026-08-01",
 "period_end": "2026-08-31",
 "sections": [ ... ],
 "style_config": { ... },
 "narrative": "August was a strong month...",
 "metrics_snapshot": { "sessions": 51234, "conversions": 2810 },
 "pdf_url": "https://cdn.example.com/reports/aurora-august-2026.pdf",
 "pdf_size_kb": 2048,
 "sent_at": "2026-09-01T09:05:00Z",
 "created_at": "2026-09-01T09:00:00Z"
 }
 ],
 "meta": { "page": 1, "limit": 20, "total": 1 }
}
```

### 6.2 Generate report

```http
POST /reports
Content-Type: application/json

{
 "client_id": "uuid",
 "template_id": "uuid",
 "period_start": "2026-08-01",
 "period_end": "2026-08-31",
 "title": "Aurora Skincare — August 2026 Report"
}
```

Runs a background job that fetches metrics, generates narrative, and produces a PDF. Returns immediately with a report in `generating` state.

**Response (202)**
```jsonc
{
 "data": {
 "id": "uuid",
 "status": "generating",
 "job_id": "uuid",
 ...
 }
}
```

### 6.3 Get report

```http
GET /reports/:id
```

**Response (200)** — full report resource.

### 6.4 Get report PDF

```http
GET /reports/:id/pdf
Content-Disposition: attachment; filename="aurora-august-2026.pdf"
```

**Response (200)** — `application/pdf` binary stream.

### 6.5 Send report

```http
POST /reports/:id/send
Content-Type: application/json

{
 "recipients": [
 {"email": "client@example.com", "name": "Client Contact"},
 {"email": "agency@brightpath.com", "name": "Account Manager"}
 ],
 "message": "Please find August's report attached."
}
```

**Response (200)**
```jsonc
{
 "data": {
 "report_id": "uuid",
 "status": "sent",
 "emails_sent": 2,
 "sent_at": "2026-09-06T10:00:00Z"
 }
}
```

### 6.6 Delete report

```http
DELETE /reports/:id
```

**Response (204)**

---

## 7. Subscriptions

### 7.1 List subscriptions

```http
GET /subscriptions?client_id=uuid&is_active=true
```

**Response (200)** — array of subscription resources.

```jsonc
{
 "data": [
 {
 "id": "uuid",
 "agency_id": "uuid",
 "client_id": "uuid",
 "template_id": "uuid",
 "name": "Aurora Skincare — Monthly",
 "frequency": "monthly",
 "day_of_month": 1,
 "period_days": 30,
 "recipients": [
 {"email": "hello@auroraskincare.com", "name": "Sarah Chen"},
 {"email": "team@brightpath.com", "name": "BrightPath Team"}
 ],
 "is_active": true,
 "last_run_at": "2026-09-01T09:02:00Z",
 "next_run_at": "2026-10-01T09:00:00Z",
 "created_at": "2026-01-20T09:00:00Z"
 }
 ]
}
```

### 7.2 Create subscription

```http
POST /subscriptions
Content-Type: application/json

{
 "client_id": "uuid",
 "template_id": "uuid",
 "name": "Aurora Skincare — Monthly",
 "frequency": "monthly",
 "day_of_month": 1,
 "period_days": 30,
 "recipients": [
 {"email": "hello@auroraskincare.com", "name": "Sarah Chen"}
 ]
}
```

**Response (201)** — subscription resource.

### 7.3 Update subscription

```http
PATCH /subscriptions/:id
Content-Type: application/json

{ "is_active": false, "day_of_month": 5 }
```

**Response (200)** — updated subscription resource.

### 7.4 Delete subscription

```http
DELETE /subscriptions/:id
```

**Response (204** — cascades to scheduled_reports.

---

## 8. Webhooks

### 8.1 List webhooks

```http
GET /webhooks
```

**Response (200)**
```jsonc
{
 "data": [
 {
 "id": "uuid",
 "agency_id": "uuid",
 "url": "https://agency.example.com/hooks/agencypulse",
 "secret": "whsec_redacted",
 "events": ["report.completed", "report.sent", "subscription.failed"],
 "is_active": true,
 "created_at": "2026-01-20T09:00:00Z"
 }
 ]
}
```

### 8.2 Create webhook

```http
POST /webhooks
Content-Type: application/json

{
 "url": "https://agency.example.com/hooks/agencypulse",
 "secret": "whsec_abc123",
 "events": ["report.completed", "report.sent"]
}
```

**Response (201)** — webhook resource.

### 8.3 Delete webhook

```http
DELETE /webhooks/:id
```

**Response (204)**

---

## Webhook Payload Format

All webhook POSTs send `Content-Type: application/json`.

```jsonc
{
 "event": "report.completed",
 "occurred_at": "2026-09-01T09:02:00Z",
 "data": {
 "report_id": "uuid",
 "agency_id": "uuid",
 "client_id": "uuid",
 "client_name": "Aurora Skincare",
 "pdf_url": "https://cdn.example.com/reports/aurora-august-2026.pdf"
 }
}
```

**Supported events:**
- `report.completed` — report finished generating
- `report.sent` — report email delivered
- `report.failed` — generation or send failure
- `subscription.completed` — scheduled run succeeded
- `subscription.failed` — scheduled run failed
- `integration.error` — integration token expired / API error
- `integration.synced` — data sync completed

**Verification:** Every payload includes an `X-AgencyPulse-Signature` header. Verify with HMAC-SHA256 using the webhook `secret`.

---

## Error Codes

| Code | HTTP | Meaning |
|---------|---------|----------------------------|
| VALIDATION_ERROR | 400 | Request body / query failed validation |
| UNAUTHORIZED | 401 | Missing or invalid bearer token |
| FORBIDDEN | 403 | Authenticated but not scoped to this agency |
| NOT_FOUND | 404 | Resource does not exist |
| CONFLICT | 409 | Business rule violation (e.g., duplicate slug) |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL | 500 | Unexpected server error |

**Validation error shape:**
```json
{
 "error": {
 "code": "VALIDATION_ERROR",
 "message": "One or more fields failed validation.",
 "details": [
 {"field": "period_end", "message": "Must be after period_start."}
 ]
 }
}
```

---

## Rate Limits

| Plan | Requests / minute |
|----------|-----------------------|
| Free | 60 |
| Pro | 600 |
| Enterprise | 6 000 |

Headers returned on every response:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
