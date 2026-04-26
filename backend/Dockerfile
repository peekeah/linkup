# ── Stage 1: install deps ──────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: build ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Stage 3: production runner ────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 backenduser

COPY --from=builder --chown=backenduser:nodejs /app/dist        ./dist
COPY --from=builder --chown=backenduser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backenduser:nodejs /app/prisma      ./prisma
COPY --from=builder --chown=backenduser:nodejs /app/package.json ./

USER backenduser
EXPOSE 8080

# migrate on every cold start, then boot the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]