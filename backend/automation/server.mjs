import http from 'http';
import { 
  testCookies, 
  fetchAdAccountStats, 
  fetchPageInsights, 
  performAction,
  initializeBrowserPool,
  shutdownBrowserPool,
  encryptCookie,
  decryptCookie,
} from './browser.mjs';

const PORT = process.env.PORT || 3100;

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    });
    return res.end();
  }

  if (method === 'GET' && path === '/health') {
    return json(res, 200, { status: 'ok', service: 'apollo-automation' });
  }

  if (method === 'POST' && path === '/api/automation/test-cookie') {
    const body = await getBody(req);
    try {
      const result = await testCookies(body);
      return json(res, result.valid ? 200 : 400, result);
    } catch (err) {
      return json(res, 500, { valid: false, error: err.message });
    }
  }

  if (method === 'POST' && path === '/api/automation/fetch-stats') {
    const body = await getBody(req);
    try {
      const stats = await fetchAdAccountStats(body);
      return json(res, 200, stats);
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  }

  if (method === 'POST' && path === '/api/automation/fetch-page-insights') {
    const body = await getBody(req);
    try {
      const stats = await fetchPageInsights(body);
      return json(res, 200, stats);
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  }

  if (method === 'POST' && path === '/api/automation/perform-action') {
    const body = await getBody(req);
    try {
      const result = await performAction(body);
      return json(res, 200, result);
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  }

  if (method === 'POST' && path === '/api/automation/encrypt-cookie') {
    const body = await getBody(req);
    try {
      const result = encryptCookie(body);
      return json(res, 200, result);
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  }

  if (method === 'POST' && path === '/api/automation/decrypt-cookie') {
    const body = await getBody(req);
    try {
      const result = decryptCookie(body.encrypted);
      return json(res, 200, { cookie: result });
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  }

  json(res, 404, { error: 'Not found' });
});

async function start() {
  try {
    console.log('🔄 Initializing browser pool...');
    await initializeBrowserPool();
    console.log('✅ Browser pool ready');
  } catch (err) {
    console.error('❌ Failed to initialize browser pool:', err);
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      });
      return res.end();
    }

    if (method === 'GET' && path === '/health') {
      return json(res, 200, { status: 'ok', service: 'apollo-automation' });
    }

    if (method === 'POST' && path === '/api/automation/test-cookie') {
      const body = await getBody(req);
      try {
        const result = await testCookies(body);
        return json(res, result.valid ? 200 : 400, result);
      } catch (err) {
        return json(res, 500, { valid: false, error: err.message });
      }
    }

    if (method === 'POST' && path === '/api/automation/fetch-stats') {
      const body = await getBody(req);
      try {
        const stats = await fetchAdAccountStats(body);
        return json(res, 200, stats);
      } catch (err) {
        return json(res, 500, { error: err.message });
      }
    }

    if (method === 'POST' && path === '/api/automation/fetch-page-insights') {
      const body = await getBody(req);
      try {
        const stats = await fetchPageInsights(body);
        return json(res, 200, stats);
      } catch (err) {
        return json(res, 500, { error: err.message });
      }
    }

    if (method === 'POST' && path === '/api/automation/perform-action') {
      const body = await getBody(req);
      try {
        const result = await performAction(body);
        return json(res, 200, result);
      } catch (err) {
        return json(res, 500, { error: err.message });
      }
    }

    if (method === 'POST' && path === '/api/automation/encrypt-cookie') {
      const body = await getBody(req);
      try {
        const result = encryptCookie(body);
        return json(res, 200, result);
      } catch (err) {
        return json(res, 500, { error: err.message });
      }
    }

    if (method === 'POST' && path === '/api/automation/decrypt-cookie') {
      const body = await getBody(req);
      try {
        const result = decryptCookie(body.encrypted);
        return json(res, 200, { cookie: result });
      } catch (err) {
        return json(res, 500, { error: err.message });
      }
    }

    json(res, 404, { error: 'Not found' });
  });

  server.listen(PORT, () => {
    console.log(`🤖 Automation service running on http://localhost:${PORT}`);
    console.log(`   Endpoints:`);
    console.log(`   POST /api/automation/test-cookie`);
    console.log(`   POST /api/automation/fetch-stats`);
    console.log(`   POST /api/automation/fetch-page-insights`);
    console.log(`   POST /api/automation/perform-action`);
    console.log(`   POST /api/automation/encrypt-cookie`);
    console.log(`   POST /api/automation/decrypt-cookie`);
  });

  process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down...');
    await shutdownBrowserPool();
    server.close(() => process.exit(0));
  });

  process.on('SIGTERM', async () => {
    await shutdownBrowserPool();
    server.close(() => process.exit(0));
  });
}

start();