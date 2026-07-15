#!/bin/bash
# start.sh - Production startup script for Apollo Automation Service

set -e

echo "🚀 Starting Apollo Automation Service..."

# Wait for Redis if configured
if [ -n "$REDIS_URL" ] || [ -n "$REDIS_TLS_URL" ]; then
  echo "⏳ Waiting for Redis..."
  for i in {1..30}; do
    if node -e "
      const { createClient } = require('redis');
      const client = createClient({ url: process.env.REDIS_URL || process.env.REDIS_TLS_URL });
      client.connect().then(() => { console.log('Redis connected'); process.exit(0); })
        .catch(() => process.exit(1));
    " 2>/dev/null; then
      echo "✅ Redis connected"
      break
    fi
    echo "  Waiting for Redis... ($i/30)"
    sleep 2
  done
fi

# Setup cron jobs
if [ "$ENABLE_CRON" = "true" ]; then
  echo "📅 Setting up cron jobs..."
  chmod +x cron-setup.sh
  ./cron-setup.sh install
  cron -f &
  CRON_PID=$!
  echo "✅ Cron started (PID: $CRON_PID)"
fi

# Initialize browser pool
echo "🔄 Initializing browser pool..."
node -e "
  const { initializeBrowserPool } = require('./browser.mjs');
  initializeBrowserPool().then(() => {
    console.log('✅ Browser pool initialized');
    process.exit(0);
  }).catch(err => {
    console.error('❌ Browser pool init failed:', err);
    process.exit(1);
  });
"

# Start the server
echo "🌐 Starting HTTP server on port ${PORT:-3100}..."
exec node server.mjs