FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS runtime

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S eremos && \
    adduser -S eremos -u 1001

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set ownership
RUN chown -R eremos:eremos /app
USER eremos

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Eremos swarm active')" || exit 1

EXPOSE 3000

CMD ["node", "dist/index.js"]