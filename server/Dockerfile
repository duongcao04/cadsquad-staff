# -----------------------------------------------------------------------------
# Stage 0: base (shared OS libs)
# -----------------------------------------------------------------------------
FROM oven/bun:1-alpine AS base
WORKDIR /app
# Cài đặt các thư viện hệ thống cần thiết cho cả Dev và Prod
RUN apk add --no-cache openssl libc6-compat postgresql16-client

# -----------------------------------------------------------------------------
# Stage 1: deps (Install dependencies & Generate Prisma)
# -----------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
COPY nest-cli.json tsconfig*.json ./

# Copy Prisma schema
COPY ./src/providers/prisma/schema.prisma ./prisma/schema.prisma
COPY ./src/providers/prisma/migrations ./prisma/migrations

# Install ALL dependencies (bao gồm devDependencies cho NestJS build và Dev mode)
RUN bun install --frozen-lockfile

# Generate Prisma client
RUN bunx prisma generate

# -----------------------------------------------------------------------------
# Stage 3: builder (Build TypeScript for Production)
# -----------------------------------------------------------------------------
FROM deps AS builder
WORKDIR /app

# Copy source code
COPY src ./src
COPY --from=deps /app/node_modules ./node_modules

# Run build (tạo thư mục dist)
RUN bun run build

# Tối ưu: Xóa devDependencies để giảm nhẹ node_modules trước khi copy sang runner
# (Lưu ý: Bun hiện tại xử lý cái này hơi khác npm, ta có thể cài lại prod deps hoặc giữ nguyên)
# Ở đây mình giữ nguyên flow của bạn để an toàn, hoặc chạy lệnh này nếu muốn clean:
# RUN rm -rf node_modules && bun install --frozen-lockfile --production

# -----------------------------------------------------------------------------
# Stage 4: runner (Production Image)
# -----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

# Tạo user non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy các file cần thiết từ Builder và Deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Copy database scripts (nếu có)
COPY database ./database

# Copy entrypoint script
COPY --chown=nodejs:nodejs ./entrypoint.sh ./
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8080

ENV NODE_ENV production

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun -e "require('http').get('http://localhost:8080/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["bun", "dist/main.js"]