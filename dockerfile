# Build frontend
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY client .
RUN npm run build

# Build backend dependencies
FROM node:20-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps

# Final runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Install only production dependencies
COPY --from=server-deps /app/server/node_modules ./node_modules

# Copy backend source code
COPY server/*.js ./
COPY server/controller ./controller
COPY server/middleware ./middleware
COPY server/models ./models
COPY server/routes ./routes
COPY server/utils ./utils

# Copy frontend build to public folder
COPY --from=client-build /app/client/dist ./public

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "index.js"]
