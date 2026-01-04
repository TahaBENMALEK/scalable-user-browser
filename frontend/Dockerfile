# Frontend Dockerfile
# Multi-stage build: Build with Node, serve with Nginx
# Optimized for production deployment

# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Accept build argument for API URL
ARG VITE_API_BASE_URL=http://localhost:3001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production bundle with environment variable
RUN VITE_API_BASE_URL=${VITE_API_BASE_URL} npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]