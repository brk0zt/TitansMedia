// Redis-based distributed browser pool for horizontal scaling
import { createClient } from 'redis';

let redisClient = null;

export async function initRedis() {
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_TLS_URL;
  if (!redisUrl) {
    console.log('⚠️  No Redis URL configured - running in single-instance mode');
    return null;
  }

  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    },
  });

  redisClient.on('error', (err) => console.error('Redis error:', err));
  redisClient.on('connect', () => console.log('✅ Redis connected'));
  redisClient.on('ready', () => console.log('✅ Redis ready'));

  await redisClient.connect();
  return redisClient;
}

export async function getRedis() {
  if (!redisClient) await initRedis();
  return redisClient;
}

// Distributed lock for browser pool coordination
export async function acquireBrowserLock(poolId, ttl = 30000) {
  const redis = await getRedis();
  if (!redis) return false;

  const lockKey = `lock:browser-pool:${poolId}`;
  const result = await redis.set(lockKey, process.env.HOSTNAME || 'local', {
    NX: true,
    EX: Math.ceil(ttl / 1000),
  });
  return result === 'OK';
}

export async function releaseBrowserLock(poolId) {
  const redis = await getRedis();
  if (!redis) return;
  const lockKey = `lock:browser-pool:${poolId}`;
  await redis.del(lockKey);
}

// Browser pool state synchronization
export async function syncPoolState(poolId, state) {
  const redis = await getRedis();
  if (!redis) return;
  const stateKey = `state:browser-pool:${poolId}`;
  await redis.set(stateKey, JSON.stringify(state), { EX: 60 });
}

export async function getPoolState(poolId) {
  const redis = await getRedis();
  if (!redis) return null;
  const stateKey = `state:browser-pool:${poolId}`;
  const data = await redis.get(stateKey);
  return data ? JSON.parse(data) : null;
}

// Proxy health tracking
export async function recordProxyResult(proxyUrl, success, latencyMs) {
  const redis = await getRedis();
  if (!redis) return;
  
  const key = `proxy:health:${proxyUrl}`;
  const data = await redis.get(key);
  const stats = data ? JSON.parse(data) : { success: 0, failed: 0, totalLatency: 0, count: 0 };
  
  if (success) {
    stats.success++;
    stats.totalLatency += latencyMs;
  } else {
    stats.failed++;
  }
  stats.count++;
  stats.lastCheck = Date.now();
  
  await redis.set(key, JSON.stringify(stats), { EX: 86400 }); // 24h TTL
}

export async function getHealthyProxies(minSuccessRate = 0.8) {
  const redis = await getRedis();
  if (!redis) return [];
  
  const keys = await redis.keys('proxy:health:*');
  const proxies = [];
  
  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const stats = JSON.parse(data);
      const successRate = stats.success / stats.count;
      if (successRate >= minSuccessRate && stats.count >= 5) {
        const proxyUrl = key.replace('proxy:health:', '');
        proxies.push({ proxyUrl, successRate, avgLatency: stats.totalLatency / stats.success });
      }
    }
  }
  
  return proxies.sort((a, b) => a.avgLatency - b.avgLatency);
}

// Cookie health check coordination
export async function recordCookieCheck(accountId, healthy, error = null) {
  const redis = await getRedis();
  if (!redis) return;
  
  const key = `cookie:health:${accountId}`;
  const data = await redis.get(key);
  const state = data ? JSON.parse(data) : { healthy: true, consecutiveFailures: 0 };
  
  if (healthy) {
    state.healthy = true;
    state.consecutiveFailures = 0;
    state.lastHealthy = Date.now();
  } else {
    state.healthy = false;
    state.consecutiveFailures++;
    state.lastError = error;
    state.lastCheck = Date.now();
  }
  
  await redis.set(key, JSON.stringify(state), { EX: 86400 });
}

export async function getCookieHealth(accountId) {
  const redis = await getRedis();
  if (!redis) return { healthy: true, consecutiveFailures: 0 };
  
  const key = `cookie:health:${accountId}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : { healthy: true, consecutiveFailures: 0 };
}

// Graceful shutdown
export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}