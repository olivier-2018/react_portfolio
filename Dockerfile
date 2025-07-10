# Use Node.js 22 Alpine as base image for smaller size
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Create a non-root user and set permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Install dependencies
RUN npm install 
#ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Set default command
# CMD ["npm", "run", "preview", "--", "--host"]
CMD ["npm", "run", "build"]

