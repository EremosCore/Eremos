# Base build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source
COPY . .

# Runtime stage
FROM node:22-alpine

WORKDIR /app

# Copy only built output + dependencies
COPY --from=builder /app /app

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# Run in production mode
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
