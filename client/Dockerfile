# Stage 1: Build the application
FROM oven/bun:1-alpine AS build

ARG VITE_APP_URL
ARG VITE_API_ENDPOINT

ENV VITE_APP_URL=${VITE_APP_URL}
ENV VITE_API_ENDPOINT=${VITE_API_ENDPOINT}

WORKDIR /app

# Copy lockfile and package.json first for better caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Vite project
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy your custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy static files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]