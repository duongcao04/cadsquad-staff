# Use Bun official image (includes bun runtime & compatible toolchain)
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy lockfile & package manifest first for caching
# If you use package-lock.json/yarn.lock/bun.lockb adjust accordingly
COPY package.json ./
COPY bun.lockb* ./

# Install dependencies with bun
RUN bun install

# Copy app source
COPY . .

# Build Next.js (expects "build" script in package.json -> "next build")
RUN bun run build

# ----- Runtime image (using same bun base for compatibility) -----
FROM oven/bun:latest AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy only what's needed for runtime from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# bun's installed deps are in /root/.bun (but bun also supports node_modules)
# Copy bun's install cache (optional, preserves installed deps)
COPY --from=builder /root/.bun /root/.bun

# If you have environment-dependent next.config.js or other files, copy them
COPY --from=builder /app/next.config.js ./next.config.js

USER nodejs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- --tries=1 --timeout=2 http://127.0.0.1:${PORT}/_next/static || exit 1

# Start the Next.js server using bun
# package.json should have: "start": "next start -p $PORT"
CMD ["bun", "run", "start"]
