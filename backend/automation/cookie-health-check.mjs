#!/usr/bin/env node
// cookie-health-check.mjs - Cron job for cookie health monitoring with Redis support
import http from 'http';
import { fetchAdAccountStats } from './browser.mjs';
import { 
  initializeRedis, 
  recordCookieCheck, 
  getCookieHealth,
  recordProxyResult 
} from './redis.mjs';

const API_BASE = process.env.API_BASE || 'http://localhost:8000/api';
const CRON_INTERVAL = parseInt(process.env.CRON_INTERVAL || '1800000'); // 30 minutes
const REDIS_URL = process.env.REDIS_URL || process.env.RAILWAY_REDIS_URL;

async function checkCookieHealth(bmId, accountId, cookies, useragent, proxy) {
  try {
    const result = await fetchAdAccountStats({ cookies, useragent, proxy, accountId });
    if (result.spend !== null || result.impressions !== null) {
      return { healthy: true, data: result };
    }
    return { healthy: false, error: 'No data returned' };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}

async function notifyTeam(bmId, accountId, error) {
  const data = JSON.stringify({
    type: 'cookie_health_alert',
    bmId,
    accountId,
    error,
    timestamp: new Date().toISOString(),
  });
  
  return new Promise((resolve) => {
    const options = {
      hostname: new URL(API_BASE).hostname,
      port: new URL(API_BASE).port || 80,
      path: '/api/automation/health-alert',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve());
    req.write(data);
    req.end();
  });
}

async function runHealthChecks() {
  console.log(`[${new Date().toISOString()}] Starting cookie health checks...`);
  
  // Initialize Redis if available
  if (REDIS_URL) {
    try {
      await import('./redis.mjs').then(m => m.initializeRedis());
      console.log('✅ Redis initialized for health tracking');
    } catch (err) {
      console.warn('⚠️ Redis initialization failed:', err.message);
    }
  }
  
  try {
    const response = await new Promise((resolve, reject) => {
      const req = http.request(`${API_BASE}/business-managers`, { method: 'GET' }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.end();
    });
    
    const bms = JSON.parse(response);
    console.log(`Found ${bms.data?.length || 0} business managers`);
    
    for (const bm of bms.data || []) {
      if (bm.id === 1) { // Focus on primary BM for now
        try {
          const accountsRes = await new Promise((resolve) => {
            http.get(`${API_BASE}/business-managers/${bm.id}/ad-accounts`, (res) => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => resolve(data));
            });
          });
          const accounts = JSON.parse(accountsRes);
          
          for (const acc of accounts.data || []) {
            if (acc.automation_mode === 'cookie' && acc.cookie) {
              console.log(`\n🔍 Checking account: ${acc.name} (${acc.id})`);
              const startTime = Date.now();
              const health = await checkCookieHealth(bm.id, acc.id, acc.cookie, acc.useragent, acc.proxy);
              const latency = Date.now() - startTime;
              
              const healthy = health.healthy;
              console.log(`  Account ${acc.name} (${acc.id}): ${healthy ? '✅ Healthy' : '❌ ' + health.error} (${latency}ms)`);
              
              // Record proxy health
              if (acc.proxy) {
                await import('./redis.mjs').then(m => m.recordProxyResult(acc.proxy, healthy, Date.now() - startTime));
              }
              
              // Record cookie health
              try {
                const { recordCookieCheck } = await import('./redis.mjs');
                await recordCookieCheck(acc.id, healthy, healthy ? null : health.error);
              } catch (e) {
                // Redis not available, skip
              }
              
              if (!healthy) {
                await notifyTeam(bm.id, acc.id, health.error);
              }
            }
          }
        } catch (err) {
          console.error(`Error checking BM ${bm.id}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('Health check failed:', err.message);
  }
  
  console.log(`[${new Date().toISOString()}] Health checks completed\n`);
}

async function start() {
  console.log('🕐 Cookie Health Check Cron Started');
  console.log(`   Interval: ${CRON_INTERVAL / 1000 / 60} minutes`);
  console.log(`   API Base: ${API_BASE}`);
  console.log(`   Redis: ${REDIS_URL ? 'Configured' : 'Not configured (local mode)'}`);
  
  // Initialize Redis if available
  if (REDIS_URL) {
    try {
      await initializeRedis();
    } catch (err) {
      console.warn('⚠️ Redis init failed:', err.message);
    }
  }
  
  await runHealthChecks();
  
  setInterval(runHealthChecks, CRON_INTERVAL);
  
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping cron job...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping cron job...');
    process.exit(0);
  });
}

start();