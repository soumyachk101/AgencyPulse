# AgencyPulse · Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker Compose)](#quick-start-docker-compose)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Migrations & Seeding](#database-migrations--seeding)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring & Health Checks](#monitoring--health-checks)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20 LTS | Runtime |
| npm | 10+ | Package management |
| Docker | 24+ | Containerisation |
| PostgreSQL | 15 | Primary database |
| Redis | 7+ | Cache & job queue |
| Fly CLI | `v2` | Fly.io deployments |
| Vercel CLI | `v30` | Frontend deployments |

---

## Quick Start (Docker Compose)

### 1. Clone and configure

```bash
cp .env.example .env.local
# Edit .env.local — at minimum set:
# DATABASE_URL
# REDIS_URL
# NEXTAUTH_SECRET
# CSRF_SECRET
# ENCRYPTION_KEY
```

### 2. Start all services

```bash
docker compose up --build -d
```

### 3. Run migrations + seed

```bash
docker compose exec app npx tsx scripts/migrate.ts
```

### 4. Verify

```bash
curl http://localhost:3003/api/health
```

Expected response:

```json
{ "status": "ok", "timestamp": "2026-09-06T..." }
```

### 5. Stop

```bash
docker compose down # keep volumes
docker compose down -v # wipe volumes (destructive)
```

---

## Production Deployment

### Option A — Fly.io (Backend API + Worker)

#### Deploy

```bash
flyctl launch # first time: creates app from fly.toml
flyctl secrets set DATABASE_URL=postgresql://...
flyctl secrets set REDIS_URL=redis://...
flyctl secrets set NEXTAUTH_SECRET=...
flyctl deploy
```

#### Scale

```bash
flyctl scale count app=2 worker=1
flyctl scale memory 1024 # per machine
```

#### Database

Use a managed Postgres:

```bash
flyctl postgres create --name agencypulse-db --region iad
flyctl postgres attach agencypulse-db
```

Or provision a volume for self-managed Postgres (see `fly.toml` mounts).

---

### Option B — Vercel (Next.js Frontend)

1. Push code to GitHub.
2. Import repo in Vercel dashboard.
3. Set environment variables (see `.env.example`).
4. Deploy — `vercel.json` handles API rewrites to Fly.io backend.

#### Vercel Cron Jobs

The `crons` block in `vercel.json` triggers serverless cron endpoints:

- `GET /api/cron/sync` — daily at 06:00 UTC
- `GET /api/cron/reports` — weekly Mondays at 05:00 UTC

Protect with `CRON_SECRET` and validate via `x-vercel-cron` header.

---

### Option C — Nginx Reverse Proxy (self-hosted)

For self-hosted deployments behind Nginx:

```bash
# Install nginx
sudo apt install nginx

# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/agencypulse.conf
sudo ln -s /etc/nginx/sites-available/agencypulse.conf /etc/nginx/sites-enabled/

# TLS via Let's Encrypt
sudo certbot --nginx -d agencypulse.app -d api.agencypulse.app

# Test + reload
sudo nginx -t && sudo systemctl reload nginx
```

The app should listen on `127.0.0.1:3003` (never expose the app port directly to the internet).

---

## Environment Variables

See [`.env.example`](.env.example) for the full list. Mandatory in every environment:

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis connection string |
| `NEXTAUTH_URL` | Full URL (including `https://`) |
| `NEXTAUTH_SECRET` | 32+ random bytes, base64 |
| `CSRF_SECRET` | 32+ random bytes, base64 |
| `ENCRYPTION_KEY` | 32 bytes, base64 (AES-256) |

Integration keys (optional, but required for full functionality):

| Variable | Integration |
|----------|-------------|
| `GOOGLE_ANALYTICS_API_KEY` | GA4 Reporting API |
| `GOOGLE_ADS_*` | Google Ads performance sync |
| `META_APP_ID` / `META_APP_SECRET` | Meta Ads Insights |
| `HUBSPOT_API_KEY` | CRM data sync |
| `SLACK_BOT_TOKEN` | Slack notifications |
| `SENDGRID_API_KEY` | Email delivery |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | AI report summaries |

Generate secrets:

```bash
openssl rand -base64 32 # NEXTAUTH_SECRET / CSRF_SECRET
openssl rand -base64 32 # ENCRYPTION_KEY
```

---

## Database Migrations & Seeding

```bash
# Apply pending migrations
npx tsx scripts/migrate.ts

# Reset (drop + re-run all migrations + seed)
npx tsx scripts/migrate.ts --reset

# Migrations only (skip seed)
npx tsx scripts/migrate.ts --no-seed
```

Create a new migration:

```bash
npx prisma migrate dev --name descriptive_name
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main`/`develop` and every tag:

1. **Lint & type-check** — `npm run lint`, `npm run typecheck`
2. **Tests** — spins up Postgres + Redis in services, runs migrations, seeds, and executes the test suite with coverage
3. **Docker image build** — pushed to GHCR (always) and Docker Hub (on tag push only)
4. **Deploy to Fly.io** — on pushes to `main` and tags
5. **Deploy to Vercel** — on pushes to `main`

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `FLY_API_TOKEN` | Fly.io auth token |
| `VERCEL_TOKEN` | Vercel auth token |
| `VERCEL_ORG_ID` | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `DATABASE_URL` | Production DB URL (for Vercel build) |
| `REDIS_URL` | Production Redis URL (for Vercel build) |
| `NEXT_PUBLIC_API_URL` | Backend URL (for Vercel build) |

---

## Monitoring & Health Checks

### Health endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | App liveness/readiness |

### Docker

```bash
docker compose ps # service status
docker compose logs -f app # app logs
docker compose logs -f worker # worker logs
```

### Fly.io

```bash
flyctl logs # stream logs
flyctl status # machine status
flyctl doctor # run diagnostics
```

### Redis

```bash
redis-cli -h localhost -p 6379 -a change_me ping
redis-cli INFO memory
redis-cli INFO clients
```

### Recommended stack

- **Metrics**: Prometheus + Grafana
- **Logs**: Loki (self-hosted) or Datadog
- **APM**: Sentry (error tracking) + OpenTelemetry
- **Uptime**: UptimeRobot or Better Uptime

---

## Troubleshooting

### `DATABASE_URL` not found

Ensure `.env.local` exists and the path matches. In Docker, variables come from `.env` file or `env_file:` in compose.

### Prisma client mismatch

```bash
npx prisma generate
```

### Port already in use

```bash
lsof -i :3003
# kill the process or set PORT=3004 in .env.local
```

### Docker build cache issues

```bash
docker compose build --no-cache
```

### Redis connection refused

Verify Redis is running:

```bash
docker compose ps redis
redis-cli ping
```

### Fly deploy fails with "no such service"

Ensure `fly.toml` is at the repo root and `flyctl launch` has been run.

---

## License

Proprietary — AgencyPulse
