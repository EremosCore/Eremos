# Multi-stage build for Eremos Agent Framework
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS runtime

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S eremos -u 1001

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application from builder stage
COPY --from=builder --chown=eremos:nodejs /app/dist ./dist
COPY --from=builder --chown=eremos:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=eremos:nodejs /app/package*.json ./

# Copy configuration files
COPY --chown=eremos:nodejs .env.example .env

# Create directories for logs and data
RUN mkdir -p /app/logs /app/data && \
    chown -R eremos:nodejs /app/logs /app/data

# Switch to non-root user
USER eremos

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV PORT=3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]

# Labels for metadata
LABEL maintainer="Eremos Core Team"
LABEL version="1.0.0"
LABEL description="Eremos Agent Framework for Solana Monitoring"
LABEL org.opencontainers.image.source="https://github.com/EremosCore/Eremos"
LABEL org.opencontainers.image.documentation="https://github.com/EremosCore/Eremos/tree/main/docs"
LABEL org.opencontainers.image.licenses="MIT"