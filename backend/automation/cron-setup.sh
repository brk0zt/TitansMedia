#!/bin/bash
# cron-setup.sh - Setup cron jobs for cookie health checks
# Usage: ./cron-setup.sh [install|remove|status]

CRON_JOB="*/30 * * * * cd /app && node cookie-health-check.mjs >> /var/log/cookie-health.log 2>&1"
CRON_COMMENT="# Apollo Automation Cookie Health Check"

case "${1:-install}" in
  install)
    echo "Installing cron job for cookie health checks (every 30 minutes)..."
    (crontab -l 2>/dev/null | grep -v "cookie-health-check.mjs"; echo "$CRON_COMMENT"; echo "$CRON_JOB") | crontab -
    echo "✅ Cron job installed"
    ;;
  remove)
    echo "Removing cron job..."
    crontab -l 2>/dev/null | grep -v "cookie-health-check.mjs" | grep -v "Apollo Automation Cookie Health" | crontab -
    echo "✅ Cron job removed"
    ;;
  status)
    echo "Current cron jobs:"
    crontab -l 2>/dev/null | grep -E "(cookie-health|Apollo)" || echo "No Apollo cron jobs found"
    ;;
  *)
    echo "Usage: $0 [install|remove|status]"
    exit 1
    ;;
esac