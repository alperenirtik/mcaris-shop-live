# syntax=docker/dockerfile:1
# MCARIS Medikal E-Ticaret Production Dockerfile (Coolify & BuildKit Optimized)
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# 1. Aşama: Bağımlılıkların Yüklenmesi (BuildKit npm cache mount)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 2. Aşama: Derleme (BuildKit Next.js build cache mount & RAM optimizasyonu)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Next.js derleme önbelleği (.next/cache) korunarak sonraki build'ler saniyelere iner
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/.next/cache \
    npm run build

# 3. Aşama: Üretim Çalıştırıcısı (Runner) - Minimum Standalone İmaj
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Coolify HTTP healthcheck (curl/wget gerekir)
RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Statik ve standalone Next.js dosyalarını kopyala
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Kalıcı disk public/uploads üzerine binince depo görselleri kaybolmasın diye ayrı kopya
COPY --from=builder --chown=nextjs:nodejs /app/public/uploads /app/bundled-uploads
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Kalıcı depolama (Persistent Storage) ve dosya yükleme izinleri
RUN mkdir -p /app/public/uploads/products /app/public/uploads/invoices /app/public/uploads/blog /app/backups && \
    chmod +x /app/scripts/sync-product-images.sh && \
    chown -R nextjs:nodejs /app/public/uploads /app/backups

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/app/scripts/sync-product-images.sh"]
CMD ["node", "server.js"]
