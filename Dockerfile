# ===========================
# Build backend (NestJS)
# ===========================
FROM node:20-alpine AS build-backend

WORKDIR /app/server

# Copy và cài dependency
COPY server/package*.json ./
RUN npm ci

# Copy source và build
COPY server ./
RUN npm run build


# ===========================
# Build frontend (Next.js)
# ===========================
FROM node:20-alpine AS build-frontend

WORKDIR /app/client

# Copy và cài dependency
COPY client/package*.json ./
RUN npm config set legacy-peer-deps true
RUN npm ci

# Copy source và build
COPY client ./
RUN npm run build


# ===========================
# Final runtime image
# ===========================
FROM node:20-alpine AS final

WORKDIR /app

# Copy build output từ các stage trước
COPY --from=build-backend /app/server/dist ./server/dist
COPY --from=build-frontend /app/client/.next ./client/.next
COPY --from=build-frontend /app/client/public ./client/public
COPY --from=build-backend /app/server/package*.json ./server/
COPY --from=build-frontend /app/client/package*.json ./client/

# Cài dependency production cho backend
WORKDIR /app/server
RUN npm ci --omit=dev

# Quay lại thư mục gốc để chạy app
WORKDIR /app

EXPOSE 3000

# Chạy NestJS (và có thể cấu hình để serve frontend nếu cần)
CMD ["node", "server/dist/main.js"]
