import { chromium, firefox, webkit } from 'playwright';
import crypto from 'crypto';
import { createClient } from 'redis';

const BROWSER_TIMEOUT = 60000;
const MAX_POOL_SIZE = parseInt(process.env.BROWSER_POOL_SIZE || '3', 10);

const ENCRYPTION_KEY = process.env.COOKIE_ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

// Redis client for distributed locking and proxy health tracking
let redisClient = null;

export async function initializeRedis() {
  if (redisClient) return redisClient;
  
  const redisUrl = process.env.REDIS_URL || process.env.RAILWAY_REDIS_URL || 'redis://localhost:6379';
  redisClient = createClient({ url: redisUrl });
  
  redisClient.on('error', (err) => console.error('❌ Redis error:', err));
  redisClient.on('connect', () => console.log('✅ Redis connected'));
  redisClient.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));
  
  await redisClient.connect();
  console.log('✅ Redis initialized for distributed locking');
  return redisClient;
}

export async function shutdownRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

export async function acquireLock(key, ttlMs = 30000) {
  if (!redisClient) return { acquired: false, error: 'Redis not initialized' };
  
  const lockKey = `lock:${key}`;
  const lockValue = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  
  const acquired = await redisClient.set(lockKey, lockValue, {
    PX: ttlMs,
    NX: true,
  });
  
  if (acquired) {
    return { acquired: true, lockValue };
  }
  return { acquired: false };
}

export async function releaseLock(key, lockValue) {
  if (!redisClient) return false;
  
  const lockKey = `lock:${key}`;
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  
  try {
    await redisClient.eval(script, { keys: [key], arguments: [lockValue] });
    return true;
  } catch {
    return false;
  }
}

export async function trackProxyHealth(proxy, success, latencyMs) {
  if (!redisClient) return;
  
  const proxyKey = `proxy:health:${proxy}`;
  const now = Date.now();
  
  const multi = redisClient.multi();
  multi.hIncrBy(proxyKey, 'total', 1);
  if (success) {
    multi.hIncrBy(proxyKey, 'success', 1);
  } else {
    multi.hIncrBy(proxyKey, 'failed', 1);
  }
  multi.hSet(proxyKey, 'lastUsed', now);
  multi.hSet(proxyKey, 'lastLatency', latencyMs);
  multi.expire(proxyKey, 86400); // 24h TTL
  await multi.exec();
}

export async function getHealthyProxies(minSuccessRate = 0.5, minRequests = 5) {
  if (!redisClient) return [];
  
  const keys = await redisClient.keys('proxy:health:*');
  if (keys.length === 0) return [];
  
  const results = [];
  for (const key of keys) {
    const health = await redisClient.hGetAll(key);
    const total = parseInt(health.total || '0');
    const success = parseInt(health.success || '0');
    const failed = parseInt(health.failed || '0');
    const lastLatency = parseInt(health.lastLatency || '999999');
    
    if (total >= minRequests && (success / total) >= minSuccessRate) {
      results.push({
        proxy: key.replace('proxy:health:', ''),
        successRate: success / total,
        total,
        success,
        failed,
        lastLatency,
        lastUsed: parseInt(health.lastUsed || '0'),
      });
    }
  }
  
  // Sort by success rate (desc) then latency (asc)
  return results.sort((a, b) => 
    b.successRate - a.successRate || a.lastLatency - b.lastLatency
  );
}

export async function getProxyForRequest() {
  const healthyProxies = await getHealthyProxies(0.5, 3);
  if (healthyProxies.length > 0) {
    // Weighted random selection favoring higher success rate
    const totalWeight = healthyProxies.reduce((sum, p) => sum + p.successRate, 0);
    let random = Math.random() * totalWeight;
    for (const proxy of healthyProxies) {
      random -= proxy.successRate;
      if (random <= 0) return proxy.proxy;
    }
return healthyProxies[0].proxy;
  }
  return getRandomProxy(); // Fallback
}

function getRandomProxy() {
  const proxies = getProxyList();
  if (proxies.length === 0) return null;
  return proxies[Math.floor(Math.random() * proxies.length)];
}

class BrowserPool {
  constructor() {
    this.browsers = [];
    this.busy = new Set();
    this.maxSize = MAX_POOL_SIZE;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    for (let i = 0; i < this.maxSize; i++) {
      const browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
        ],
      });
      this.browsers.push({ browser, lastUsed: Date.now(), pageCount: 0 });
    }
    this.initialized = true;
    console.log(`🚀 Browser pool initialized with ${this.maxSize} browsers`);
  }

  async acquire(proxyOverride = null) {
    if (!this.initialized) await this.initialize();

    let available = this.browsers.find(b => !this.busy.has(b.browser) && b.pageCount < 5);
    
    if (!available) {
      const oldest = this.browsers.reduce((a, b) => a.lastUsed < b.lastUsed ? a : b);
      if (oldest.pageCount >= 5) {
        await oldest.browser.close();
        const browser = await chromium.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        });
        oldest.browser = browser;
        oldest.pageCount = 0;
        oldest.lastUsed = Date.now();
      }
      available = oldest;
    }

    this.busy.add(available.browser);
    available.lastUsed = Date.now();
    available.pageCount++;

    const proxy = proxyOverride || getRandomProxy();
    const context = await this.createStealthContext(available.browser, proxy);
    return { browser: available.browser, context, poolRef: available, proxy };
  }

  release(browser, poolRef, proxy = null) {
    this.busy.delete(browser);
    if (poolRef) poolRef.pageCount = Math.max(0, poolRef.pageCount - 1);
    if (proxy) {
      console.log(`🔁 Released browser with proxy: ${proxy}`);
    }
  }

  async createStealthContext(browser, proxy = null) {
    const viewport = VIEWPORTS[Math.floor(Math.random() * VIEWPORTS.length)];
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const language = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    
    const contextOptions = {
      viewport,
      userAgent,
      locale: language.split(',')[0],
      timezoneId: 'Europe/Istanbul',
      geolocation: { longitude: 28.9784, latitude: 41.0082 },
      permissions: ['geolocation'],
      colorScheme: 'light',
      reducedMotion: 'reduce',
      forcedColors: 'none',
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    };

    if (proxy) {
      contextOptions.proxy = { server: proxy };
    }
    
    const context = await browser.newContext(contextOptions);

    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'tr'] });
      window.chrome = { runtime: {} };
      Object.defineProperty(navigator, 'permissions', {
        get: () => ({
          query: () => Promise.resolve({ state: 'granted' })
        })
      });
      const originalQuery = window.navigator.permissions?.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ? Promise.resolve({ state: 'denied' }) : originalQuery(parameters)
      );
    });

    return context;
  }

  async shutdown() {
    for (const { browser } of this.browsers) {
      await browser.close();
    }
    this.browsers = [];
    this.busy.clear();
    this.initialized = false;
  }
}

const browserPool = new BrowserPool();

export function encryptCookie(cookieData) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const json = JSON.stringify(cookieData);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    encrypted: Buffer.concat([iv, authTag, encrypted]).toString('base64'),
  };
}

export function decryptCookie(encryptedBase64) {
  const data = Buffer.from(encryptedBase64, 'base64');
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = data.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}

function parseCookies(cookieInput) {
  if (!cookieInput) return [];
  if (typeof cookieInput === 'object' && !Array.isArray(cookieInput)) {
    const result = [];
    for (const [name, value] of Object.entries(cookieInput)) {
      if (value) result.push({ name, value: String(value), domain: '.facebook.com', path: '/', httpOnly: false, secure: true, sameSite: 'Lax' });
    }
    return result;
  }
  return cookieInput.split(';').map(pair => {
    const [name, ...rest] = pair.trim().split('=');
    if (!name) return null;
    return { name: name.trim(), value: rest.join('=').trim(), domain: '.facebook.com', path: '/', httpOnly: false, secure: true, sameSite: 'Lax' };
  }).filter(Boolean);
}

export async function createContext({ cookies, useragent, proxy, fingerprint }) {
  await browserPool.initialize();
  const { browser, context, poolRef, proxy: usedProxy } = await browserPool.acquire(proxy);
  
  const parsedCookies = parseCookies(cookies);
  if (parsedCookies.length > 0) {
    await context.addCookies(parsedCookies);
  }

  return { browser, context, poolRef, proxy: usedProxy };
}

export async function testCookies({ cookies, useragent, proxy, fingerprint }) {
  const { browser, context, poolRef, proxy: usedProxy } = await createContext({ cookies, useragent, proxy, fingerprint });
  try {
    const page = await context.newPage();
    await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle', timeout: BROWSER_TIMEOUT });
    await page.waitForTimeout(3000);
    const url = page.url();
    const isLoggedIn = !url.includes('login') && !url.includes('checkpoint');
    return { valid: isLoggedIn, url, proxy: usedProxy };
  } finally {
    await context.close();
    browserPool.release(poolRef.browser, poolRef, usedProxy);
  }
}

async function waitForSelector(page, selectors, timeout = 5000) {
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      return selector;
    } catch {
      continue;
    }
  }
  return null;
}

async function scrapeAdAccount(page, accountId) {
  await page.goto(`https://business.facebook.com/ads/manager/account/${accountId}/`, { waitUntil: 'networkidle', timeout: BROWSER_TIMEOUT });
  await page.waitForTimeout(4000);
  
  const data = await page.evaluate(() => {
    const getText = (selectors) => {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el.innerText.trim();
      }
      return null;
    };
    
    const parseNumber = (str) => {
      if (!str) return null;
      const clean = str.replace(/[^\d.,]/g, '').replace(',', '');
      const num = parseFloat(clean);
      return isNaN(num) ? null : num;
    };

    return {
      spend: parseNumber(getText([
        '[data-testid="account_spend"]',
        '[data-testid="account_spend_amount"]',
        'span:has-text("Spend") + span',
        'div[role="heading"]:has-text("Spend") ~ div',
      ])),
      impressions: parseNumber(getText([
        '[data-testid="account_impressions"]',
        'span:has-text("Impressions") + span',
        'div[role="heading"]:has-text("Impressions") ~ div',
      ])),
      clicks: parseNumber(getText([
        '[data-testid="account_clicks"]',
        'span:has-text("Clicks") + span',
        'div[role="heading"]:has-text("Clicks") ~ div',
      ])),
      reach: parseNumber(getText([
        '[data-testid="account_reach"]',
        'span:has-text("Reach") + span',
      ])),
      ctr: parseNumber(getText([
        'span:has-text("CTR") + span',
        '[data-testid="account_ctr"]',
      ])),
      cpm: parseNumber(getText([
        'span:has-text("CPM") + span',
        '[data-testid="account_cpm"]',
      ])),
    };
  });
  
  return data;
}

export async function fetchAdAccountStats({ cookies, useragent, proxy, fingerprint, accountId }) {
  const { browser, context, poolRef, proxy: usedProxy } = await createContext({ cookies, useragent, proxy, fingerprint });
  try {
    const page = await context.newPage();
    
    await page.route('**/*.{png,jpg,jpeg,gif,woff,woff2,css}', route => route.abort());
    
    const stats = await scrapeAdAccount(page, accountId);
    return { ...stats, source: 'cookie', accountId, proxy: usedProxy };
  } finally {
    await context.close();
    browserPool.release(poolRef.browser, poolRef, usedProxy);
  }
}

async function scrapePageInsights(page, pageId) {
  await page.goto(`https://business.facebook.com/latest/insights/overview?pages=[${pageId}]`, { waitUntil: 'networkidle', timeout: BROWSER_TIMEOUT });
  await page.waitForTimeout(4000);
  
  return await page.evaluate(() => {
    const getText = (selectors) => {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el.innerText.trim();
      }
      return null;
    };
    const parseNumber = (str) => {
      if (!str) return null;
      const clean = str.replace(/[^\d.,]/g, '').replace(',', '');
      const num = parseFloat(clean);
      return isNaN(num) ? null : num;
    };
    return {
      followers: parseNumber(getText([
        '[data-testid="page_followers"]',
        'span:has-text("Followers") + span',
      ])),
      likes: parseNumber(getText([
        '[data-testid="page_likes"]',
        'span:has-text("Likes") + span',
      ])),
      reach: parseNumber(getText([
        '[data-testid="page_reach"]',
        'span:has-text("Reach") + span',
      ])),
      engagement: parseNumber(getText([
        '[data-testid="page_engagement"]',
        'span:has-text("Engagement") + span',
      ])),
    };
  });
}

export async function fetchPageInsights({ cookies, useragent, proxy, fingerprint, pageId }) {
  const { browser, context, poolRef } = await createContext({ cookies, useragent, proxy, fingerprint });
  try {
    const page = await context.newPage();
    await page.route('**/*.{png,jpg,jpeg,gif,woff,woff2,css}', route => route.abort());
    const stats = await scrapePageInsights(page, pageId);
    return { ...stats, source: 'cookie', pageId };
  } finally {
    await context.close();
    browserPool.release(poolRef.browser, poolRef);
  }
}

export async function performAction({ cookies, useragent, proxy, fingerprint, action, params }) {
  const { browser, context, poolRef } = await createContext({ cookies, useragent, proxy, fingerprint });
  try {
    const page = await context.newPage();
    await page.route('**/*.{png,jpg,jpeg,gif,woff,woff2,css}', route => route.abort());
    
    switch (action) {
      case 'invite_user': {
        await page.goto(`https://business.facebook.com/settings/people?business_id=${params.bmId}`, { waitUntil: 'networkidle', timeout: BROWSER_TIMEOUT });
        await page.waitForTimeout(3000);
        await page.fill('input[aria-label="Email address"]', params.email);
        await page.click('button:has-text("Next")');
        await page.waitForTimeout(2000);
        await page.click(`text=${params.role}`);
        await page.click('button:has-text("Invite")');
        await page.waitForTimeout(3000);
        return { success: true, action: 'invite_user' };
      }
      case 'change_role': {
        await page.goto(`https://business.facebook.com/settings/people?business_id=${params.bmId}`, { waitUntil: 'networkidle', timeout: BROWSER_TIMEOUT });
        await page.waitForTimeout(3000);
        await page.click(`tr:has-text("${params.email}") button[aria-label="Edit"]`);
        await page.waitForTimeout(1000);
        await page.click(`text=${params.newRole}`);
        await page.click('button:has-text("Save")');
        await page.waitForTimeout(2000);
        return { success: true, action: 'change_role' };
      }
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } finally {
    await context.close();
    browserPool.release(poolRef.browser, poolRef);
  }
}

export async function initializeBrowserPool() {
  await browserPool.initialize();
}

export async function shutdownBrowserPool() {
  await browserPool.shutdown();
}

export { browserPool };