# ──────────────────────────────────────────────────────────────
# AgencyPulse · Dockerfile
# Multi-stage: builds the Next.js frontend + Fastify backend,
# then runs the Fastify server on port 3003.
# ──────────────────────────────────────────────────────────────

# ── Stage 1: builder ──────────────────────────────────────────
FROM node:20-alpine AS builder

# OS-level build deps (sharp, canvas, bcrypt, etc.)
RUN apk add --no-cache \
 python3 make g++ \
 libc6-compat \
 libpng-dev libjpeg-turbo-dev libwebp-dev \
 && ln -s /usr/bin/python3 /usr/local/bin/python

WORKDIR /app

# Install deps first (layer caching for monorepo workspaces)
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/
RUN npm ci --prefer-offline --no-audit

# Copy full monorepo and build both workspaces
COPY . .

# Generate Prisma client for the backend schema
RUN npx prisma generate --schema=./backend/prisma/schema.prisma

# Build frontend (Next.js -> standalone) and backend (tsc -> dist)
RUN npm run build

# Prune dev deps so runner image stays lean
RUN npm prune --production && npm cache clean --force

# ── Stage 2: runner ───────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
 adduser --system --uid 1001 nextjs

# Copy built artefacts from builder

# Next.js standalone output (served by Fastify as static files)
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/frontend/public ./frontend/public

# Fastify backend (compiled TypeScript)
COPY --from=builder --chown=nextjs:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=nextjs:nodejs /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/backend/prisma ./backend/prisma

# Shared workspace (compiled)
COPY --from=builder --chown=nextjs:nodejs /app/shared/dist ./shared/dist
COPY --from=builder --chown=nextjs:nodejs /app/shared/node_modules ./shared/node_modules

# Root-level node_modules (workspace symlinks resolved)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3003

ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

# Health check — Fastify health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
 CMD node -e "fetch('http://localhost:'+process.env.PORT+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Entrypoint: start the Fastify backend server
CMD ["node", "backend/dist/index.js"]
