# AgencyPulse — Backend Architecture

## 1. High-Level Overview

```
 ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
 │ Web Frontend │──HTTP──▶│ REST API │──SQL──▶│ Postgres (RLS) │
 └────────────────────┘ │ (Node/Nest) │ └────────────────────┘
 │ │ │
 │ │ ┌──────────────────┐
 ┌────────────────────┐ │ │ Worker Pool │
 │ 3rd-Party │──OAuth──▶│ Integrations │─────────▶│ (BullMQ/Redis) │
 │ Platforms │ │ Adapter │ └──────────────────┘
 └────────────────────┘ └──────────────────┘ │ │
 │ │
 ▼ ▼
 ┌────────────────────┐ ┌────────────────────┐
 │ AI Narrative │ │ PDF Generator │
 │ Service │ │ (Puppeteer/Headless │
 │ (LLM gateway) │ │ Chromium) │
 └────────────────────┘ └────────────────────┘
 │
 ▼
 ┌────────────────────┐
 │ Object Storage │
 │ (S3 / Supabase) │
 └────────────────────┘
```

The platform is split into three runtime surfaces:

1. **REST API** — synchronous request/response for CRUD, queries, and report generation triggers.
2. **Worker Pool** — async jobs for integration syncs, report generation, scheduled runs, and email delivery.
3. **Webhook Dispatcher** — outbound HTTPS calls whenever a watched event fires.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|------------------|---------------------|------------------------------------|
| API | Node.js / NestJS | TypeScript, OpenAPI codegen |
| DB | PostgreSQL 16 | Supabase-compatible, RLS enabled |
| ORM | Prisma or Kysely | Schema is the source of truth |
| Queue | BullMQ + Redis | Reliable retries, cron triggers |
| Job Scheduler | BullMQ repeatable jobs | Drives `next_run_at` |
| Storage | S3-compatible | Signed URLs for PDF delivery |
| Email | Resend / SES | Templated delivery |
| AI | OpenAI / Anthropic API | Behind a vendor-agnostic gateway |
| PDF | Headless Chromium | Charts via Chart.js, narrative via HTML |
| Webhooks | Custom dispatcher | HMAC-signed, retryable |

---

## 3. Module Layout

```
apps/
 api/ # NestJS REST API
 ├─ src/modules/
 │ ├─ agencies/
 │ ├─ clients/
 │ ├─ integrations/
 │ ├─ metrics/
 │ ├─ templates/
 │ ├─ reports/
 │ ├─ subscriptions/
 │ ├─ webhooks/
 │ └─ common/ (guards, interceptors, RLS context)
 └─ src/main.ts
 worker/
 ├─ jobs/
 │ ├─ IntegrationSync.job.ts
 │ ├─ ReportGenerate.job.ts
 │ ├─ ReportSend.job.ts
 │ └─ WebhookDispatch.job.ts
 ├─ schedulers/
 │ └─ SubscriptionRunner.scheduler.ts
 └─ ai/
 ├─ NarrativeGenerator.service.ts
 └─ PromptBuilder.ts
```

---

## 4. Data Fetching Service

### 4.1 Responsibilities

- Pull metrics on demand from each integration.
- Persist into the `metrics` table.
- Refresh integration metadata when accounts change.
- Surface sync errors back to the API.

### 4.2 Adapter Pattern

Every platform (Google Analytics, Facebook, etc.) implements:

```ts
interface IntegrationAdapter {
 platform: Platform;
 refresh(integration: Integration): Promise<void>; // refresh tokens, metadata
 sync(integration: Integration, period: DateRange): Promise<MetricPayload[]>;
 verify(integration: Integration): Promise<{ ok: boolean; reason?: string }>;
}
```

A `IntegrationAdapterFactory` returns the right adapter based on `platform`.

### 4.3 Sync Flow

1. **Trigger** — `POST /clients/:id/integrations/:id/sync` enqueues a BullMQ job: `IntegrationSync(integrationId, period)`.
2. **Lock** — The job acquires a Redis lock keyed on `integrationId` to avoid duplicate syncs.
3. **Token Refresh** — Adapter refreshes OAuth tokens when needed and updates `credentials`.
4. **Fetch** — Adapter calls the platform API in paginated batches with exponential backoff and rate-limit awareness.
5. **Persist** — Metrics are written to `metrics` via a batched `INSERT … ON CONFLICT DO NOTHING` keyed on `(client_id, integration_id, metric_type, period_start)`.
6. **Status Update** — On success, set `last_synced_at`. On failure, mark `status = 'error'` and store `error_message`.
7. **Emit Events** — Fire `integration.synced` or `integration.error` for the Webhook Dispatcher.

### 4.4 Reliability

- **Retries** — BullMQ retries 3× with backoff (2 s, 30 s, 5 min).
- **DLQ** — Jobs that fail permanently land in `integration-sync-dlq` for ops review.
- **Backpressure** — Per-platform token-bucket to avoid rate-limit bans.

---

## 5. Narrative Generation

### 5.1 Prompt Construction

The AI service receives a structured prompt built by `PromptBuilder`:

```
Inputs:
- agency.name, agency.settings (brand voice hints)
- client.name, client.industry
- sections enabled in the template
- metrics_snapshot (current + previous period, computed deltas, top movers)
- style_config (tone: "executive" | "casual", max word count)

Output: JSON
{
 "executive_summary": "string",
 "highlights": ["string", "string", "string"],
 "section_narratives": { "platform_breakdown": "string", ... },
 "recommendations": ["string", "string", "string"]
}
```

### 5.2 Provider Gateway

A `NarrativeGeneratorService` hides the LLM choice behind a single interface:

```ts
interface NarrativeGenerator {
 generate(input: NarrativeInput, opts?: { tone?: Tone; maxWords?: number; }): Promise<NarrativeOutput>;
}
```

Implementations live behind a factory — `OpenAINarrativeGenerator`, `AnthropicNarrativeGenerator`, `MockNarrativeGenerator` (for tests). The API picks one based on the agency plan.

### 5.3 Guardrails

- Output is validated against a Zod schema before being persisted.
- Hallucination control: the prompt only includes metrics that exist in `metrics_snapshot`. The model is instructed never to invent numbers.
- Tone / length / brand voice knobs surface to template authors via `style_config`.

### 5.4 Caching

Narratives are deterministic given their input. A SHA-256 hash of the prompt is the cache key in Redis. Cache TTL: 7 days.

---

## 6. PDF Generation

### 6.1 Approach

Use **Headless Chromium** (Puppeteer / Playwright) to render an HTML template to PDF. This gives:

- Pixel-perfect branding control via CSS.
- Native rendering of charts (Chart.js or D3 inline).
- Easy embedding of the AI narrative.

### 6.2 Pipeline

1. The `ReportGenerate` job receives the assembled `Report` row (sections + narrative + metrics_snapshot).
2. `PdfRenderService` builds the HTML using a Handlebars-style template:
 - Cover page (client logo, period, agency branding)
 - Executive summary + highlights
 - Per-section renders (charts + tables)
 - Recommendations page
 - Footer with generated-at timestamp and unique report ID
3. The HTML is loaded into Chromium and printed with a paper size / margins config matching `style_config`.
4. PDF is uploaded to object storage; the URL and `pdf_size_kb` are saved on the `reports` row.
5. `status` transitions to `completed`.

### 6.3 Performance

- Chromium runs as a **shared pool** (one process per CPU, each serving a queue) to amortize startup cost.
- PDFs are rendered in parallel up to a configurable concurrency (default 4).
- HTML templates are precompiled.

### 6.4 Reliability

- Render failures retry once; on second failure the report is marked `failed` and a `report.failed` event fires.
- `pdf_url` is always a signed URL — the original PDF is never publicly accessible.

---

## 7. Report Scheduling

### 7.1 Cron Strategy

`subscriptions.next_run_at` is recomputed whenever a subscription is created/updated and after every successful run. A small **tick scheduler** runs every minute:

```sql
SELECT id FROM subscriptions
WHERE is_active = true
 AND next_run_at <= now()
LIMIT 100;
```

For each row, a `SubscriptionRunner` job is enqueued. Two strategies:

1. **Recompute on demand** (chosen) — simple, one query per minute.
2. **Repeatable BullMQ jobs** — one job per subscription, repeats at `next_run_at`. More complex but avoids the poll.

### 7.2 Run Flow

```
SubscriptionRunner(subscriptionId, triggeredAt)
 ├─ Create scheduled_reports row (status = running)
 ├─ Snapshot subscription fields into the report
 ├─ Compute period_start / period_end from subscription.period_days
 ├─ Enqueue ReportGenerate(scheduledReportId)
 └─ Update subscription.next_run_at
```

### 7.3 Failure Handling

- If `ReportGenerate` fails, the `scheduled_reports` row is updated with the error.
- After N consecutive failures (default 3), the subscription is auto-paused and an email is sent to the agency owner.

---

## 8. Webhooks

### 8.1 Outbound Webhooks

Each agency can register endpoints that receive HTTPS POSTs.

**Signing:**
```
signature = HMAC_SHA256(secret, raw_body)
header = "X-AgencyPulse-Signature: t=<unix_ts>,v1=<signature>"
```

Recipients verify the timestamp to prevent replay.

### 8.2 Delivery Loop

1. Event emitted → `WebhookDispatch(event, data)` enqueued.
2. Worker POSTs the event with a 10-second timeout.
3. Success = 2xx response. Failure = non-2xx, timeout, or DNS error.
4. **Retry schedule:** 30 s, 5 min, 30 min, 2 h, 12 h, 24 h. Max 6 attempts.
5. After max attempts, the dispatch is dropped and logged. Agency admins see failed deliveries in a dashboard.

### 8.3 Event Catalog

| Event | Fired When |
|------------------|------------------------------------|
| report.completed | PDF generated |
| report.sent | Recipients emailed |
| report.failed | Generation or send failure |
| subscription.completed | Scheduled run finished |
| subscription.failed | Scheduled run failed |
| integration.error | Platform returned error |
| integration.synced | Sync job succeeded |

### 8.4 Inbound Webhooks (future)

For integrations that need push delivery (e.g., HubSpot subscription events). Implementation TBD.

---

## 9. Security

- **RLS** on every Postgres table (see `DATABASE_SCHEMA.md`).
- **Encryption at rest** for `integrations.credentials`.
- **HMAC signatures** on outbound webhooks.
- **Audit log** table (`audit_log`) appended for every state-changing action.
- **Secrets** stored in environment + secret manager (AWS Secrets Manager / Doppler).
- **Rate limiting** per IP and per agency (Redis token bucket).
- **Per-agency isolation**: every query is scoped via the authenticated user's `agency_id`; RLS provides the final backstop.

---

## 10. Observability

- **Logging:** structured JSON via `pino`, shipped to a log pipeline (Datadog / Loki).
- **Metrics:** Prometheus endpoint on the API; queue depth, render time, LLM latency tracked.
- **Tracing:** OpenTelemetry across API → Worker → adapters, sampled at 10 % baseline and 100 % for report generation.
- **Alerting:**
 - Render failure rate > 5 % in 15 min
 - Queue depth > 1 000 jobs for > 5 min
 - Integration sync failure spike per platform

---

## 11. Deployment Topology

```
┌──────────────────────┐ ┌──────────────────────┐
│ API replicas (3+) │ │ Worker replicas (2+)│
│ behind ALB │ │ consuming same Redis │
└──────────────────────┘ └──────────────────────┘
 │ │
 └─────────────┴─────────────┐
 ▼
 ┌──────────────────────┐
 │ Postgres (RDS / │──RLS──▶ API + Worker
 │ Supabase) │
 └──────────────────────┘
 ┌──────────────────────┐
 │ Redis (Elasticache) │──BullMQ──▶ Worker
 └──────────────────────┘
 ┌──────────────────────┐
 │ Object Storage (S3) │──signed URL──▶ PDF delivery
 └──────────────────────┘
```

- **Stateless API** scales horizontally.
- **Worker pool** scales based on queue depth.
- **Cron tick** runs on every worker but Redis locks ensure only one tick executes.

---

## 12. Future Extensions

- **Multi-user / roles** inside an agency (admin, editor, viewer).
- **White-label portals** — embeddable reports for client self-service.
- **Anomaly detection** in metrics — auto-flag when a metric moves > N standard deviations.
- **Custom integrations** via a JSON schema DSL.
- **Real-time dashboards** backed by a websocket gateway.
