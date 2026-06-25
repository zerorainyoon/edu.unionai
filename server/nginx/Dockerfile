# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cache layer)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:1.27-alpine AS runner

# Remove default nginx config and static files
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY server/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
