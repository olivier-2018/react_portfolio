# Multi-stage build
# Stage 1: Build frontend and backend dependencies
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy client package files
COPY client/package.json client/package-lock.json ./client/

# Install all dependencies (root + client)
RUN npm ci && cd client && npm ci

# Copy all source files
COPY . .

# Build React frontend to client/dist
RUN npm run build:client

# Compile TypeScript backend to dist/
RUN npx tsc

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose backend port (documentation only)
# See port binding in src/app.ts and docker-compose)
EXPOSE 3003

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start backend server
CMD ["npm", "run", "start:prod"]
