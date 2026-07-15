# Apollo Automation Service - Dockerfile
FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 3100

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3100/health', (r) => { if (r.statusCode !== 200) process.exit(1) })"

# Start
CMD ["node", "server.mjs"]