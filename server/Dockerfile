# Stage 0: base - Sử dụng bản slim chuẩn của Bun (Debian-based)
FROM oven/bun:1-slim AS base
WORKDIR /app

# Cài đặt thư viện hệ thống cần thiết (Dùng cho Prisma và kết nối Postgres)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    libsqlite3-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Stage 1: deps - Cài đặt thư viện Node.js
FROM base AS deps
COPY package.json bun.lockb* ./
# Copy Prisma schema để chuẩn bị generate client
COPY ./src/providers/prisma/schema.prisma ./prisma/schema.prisma
COPY ./src/providers/prisma ./prisma
RUN bun install --frozen-lockfile

# Stage 2: builder - Build mã nguồn TypeScript
FROM deps AS builder
COPY . .
RUN bun run build

# TỐI ƯU: Xóa node_modules cũ và chỉ cài lại bản Production để giảm dung lượng
RUN rm -rf node_modules && bun install --frozen-lockfile --production
# Tạo Prisma Client cho môi trường chạy thực tế
RUN bunx prisma generate

# Stage 3: runner - Môi trường Production cuối cùng
FROM base AS runner
WORKDIR /app

# Tạo User và Group theo chuẩn Debian (Fix lỗi addgroup/adduser not found)
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nodejs

# Copy kết quả build từ Stage 2 sang Stage 3
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/config /app/src/config

# Copy và xử lý Entrypoint script
COPY --chown=nodejs:nodejs ./entrypoint.sh ./
# Sửa định dạng file (CRLF to LF) và cấp quyền thực thi
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# Phân quyền thư mục cho user không có quyền root (Bảo mật)
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8080
ENV NODE_ENV production

# Entrypoint chạy migration trước, CMD khởi động Server sau
ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["bun", "dist/src/main.js"]