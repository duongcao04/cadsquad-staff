# -----------------------------------------------------------------------------
# Stage 0: base (shared)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

# Copy package files first (for better caching)
COPY package*.json ./
# copy lock file if exists
COPY pnpm-lock.yaml* yarn.lock* package-lock.json* bun.lock* ./

# -----------------------------------------------------------------------------
# Stage 1: deps - install dependencies and generate Prisma client
# -----------------------------------------------------------------------------
FROM base AS deps

# install deps
RUN npm ci --only=production=false || npm install

# Copy Prisma schema & migrations explicitly so prisma generate works
COPY ./src/providers/prisma/schema.prisma ./prisma/schema.prisma
COPY ./src/providers/prisma/migrations ./prisma/migrations

# If you use prisma client generation
RUN npx prisma generate

# -----------------------------------------------------------------------------
# Stage 2: builder - build TypeScript (nest build)
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy prisma generated client (so build can reference it if needed)
COPY --from=deps /app/prisma ./prisma

# Copy source files needed for build
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
COPY package*.json ./
# Copy Prisma schema + migrations
COPY src/providers/prisma/schema.prisma ./prisma/
COPY src/providers/prisma/migrations ./prisma/migrations

# Run build (nest build => outputs to dist/)
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: runner - minimal runtime image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# copy node_modules for production only
COPY --from=deps /app/node_modules ./node_modules
# copy prisma client & migrations if runtime needs them
COPY --from=deps /app/prisma ./prisma
# copy built dist
COPY --from=builder /app/dist ./dist
# copy package.json to allow running npm scripts if necessary
COPY --from=builder /app/package*.json ./

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# At container start, deploy migrations then start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
