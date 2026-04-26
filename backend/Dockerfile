FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY prisma ./prisma          # ← add this
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 backenduser

COPY --from=builder --chown=backenduser:nodejs /app/dist         ./dist
COPY --from=builder --chown=backenduser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backenduser:nodejs /app/prisma       ./prisma
COPY --from=builder --chown=backenduser:nodejs /app/package.json ./

USER backenduser
EXPOSE 8080
CMD ["bun", "dist/index.js"]