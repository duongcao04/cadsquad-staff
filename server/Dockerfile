# Stage 0: base - Thiết lập hệ điều hành cơ sở (Dùng Bookworm Slim để ổn định nhất)
FROM oven/bun:1-bookworm-slim AS base
WORKDIR /app

# Cài đặt các gói hệ thống cần thiết cho Prisma và Postgres
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    libsqlite3-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Stage 1: deps - Cài đặt thư viện
FROM base AS deps
COPY package.json bun.lockb* ./
# Copy Prisma schema để generate client ngay trong bước cài đặt
COPY ./src/providers/prisma/schema.prisma ./prisma/schema.prisma
RUN bun install --frozen-lockfile

# Stage 2: builder - Biên dịch TypeScript sang JavaScript
FROM deps AS builder
COPY . .
RUN bun run build

# TỐI ƯU: Xóa sạch node_modules và chỉ cài lại các gói Production để giảm dung lượng
RUN rm -rf node_modules && bun install --frozen-lockfile --production
# Generate Prisma Client cho môi trường Production
RUN bunx prisma generate

# Stage 3: runner - Môi trường thực thi cuối cùng (Siêu nhẹ)
FROM base AS runner
WORKDIR /app

# FIX LỖI: Sử dụng lệnh groupadd/useradd của Debian thay cho addgroup/adduser của Alpine
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nodejs

# Copy kết quả từ các bước build trước
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Xử lý file Entrypoint (Dùng để chạy migration trước khi start app)
COPY --chown=nodejs:nodejs ./entrypoint.sh ./
# Fix lỗi xuống dòng nếu file được tạo từ Windows và cấp quyền thực thi
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

# Phân quyền lại thư mục cho user non-root để đảm bảo bảo mật
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8080
ENV NODE_ENV production

# Lệnh khởi chạy: entrypoint sẽ chạy trước (migrate DB), sau đó CMD sẽ chạy (start app)
# ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["bun", "dist/main.js"]