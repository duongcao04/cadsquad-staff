# Stage 1: Build the application
FROM oven/bun:1-alpine AS build

WORKDIR /app

# Copy lockfile and package.json first for better caching
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Vite project
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]