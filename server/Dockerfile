# Stage 0: base
FROM oven/bun:1-slim AS base
WORKDIR /app

RUN sed -i 's/deb.debian.org/ftp.us.debian.org/g' /etc/apt/sources.list.d/debian.sources || true

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    libsqlite3-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Stage 1: deps
FROM base AS deps
COPY package.json bun.lockb* ./
COPY ./src/providers/prisma/schema.prisma ./prisma/schema.prisma
RUN bun install --frozen-lockfile

# Stage 2: builder
FROM deps AS builder
COPY . .
RUN bun run build
# Xóa devDeps và cài lại chỉ Production dependencies
RUN rm -rf node_modules && bun install --frozen-lockfile --production
RUN bunx prisma generate

# Stage 3: runner
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --chown=nodejs:nodejs ./entrypoint.sh ./
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 8080
ENV NODE_ENV production
ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["bun", "dist/main.js"]