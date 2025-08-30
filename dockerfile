# Build frontend
FROM node:20 AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY client .
RUN npm run build

# Build backend
FROM node:20 AS server-build
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY server .

# Copy frontend build to backend public folder
COPY --from=client-build /app/client/dist ./public

# Set environment variables (can be overridden by Render)
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port (serves API and static files)
EXPOSE 5000

# Start backend
CMD ["node", "index.js"]
