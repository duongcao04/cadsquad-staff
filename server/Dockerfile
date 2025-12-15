# -----------------------------------------------------------------------------
# Stage 0: base (shared)
# -----------------------------------------------------------------------------
FROM oven/bun:1-alpine AS base
WORKDIR /app
# OpenSSL and libc6-compat are still often needed in Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy package files (prioritize bun.lockb if you have one)
COPY package.json bun.lockb* ./

# -----------------------------------------------------------------------------
# Stage 1: deps - install dependencies and generate Prisma client
# -----------------------------------------------------------------------------
FROM base AS deps

# Install dependencies (including devDependencies for NestJS build)
RUN bun install --frozen-lockfile

# Copy Prisma schema & migrations
COPY ./src/providers/prisma/schema.prisma ./prisma/schema.prisma
COPY ./src/providers/prisma/migrations ./prisma/migrations

# Generate Prisma client
RUN bunx prisma generate

# -----------------------------------------------------------------------------
# Stage 2: builder - build TypeScript (nest build)
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy prisma generated client
COPY --from=deps /app/prisma ./prisma

# Copy source files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
COPY package.json ./

# Run build
RUN bun run build

# -----------------------------------------------------------------------------
# Stage 3: runner - minimal runtime image
# -----------------------------------------------------------------------------
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Install system dependencies
RUN apk update && apk add --no-cache \
    openssl \
    libc6-compat \
    postgresql16-client

# Create non-root user (sticking to 'nodejs' to match your previous setup)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy node_modules
# Note: To optimize image size further, you could add a separate stage 
# to run `bun install --production` and copy that here instead.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

COPY database ./database

# Copy entrypoint script
COPY --chown=nodejs:nodejs ./entrypoint.sh ./
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8080

# Bun implements Node.js compatibility, so the http check still works via 'bun -e'
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD bun -e "require('http').get('http://localhost:8080/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["bun", "dist/main.js"]