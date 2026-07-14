import http from 'http';

const PORT = process.env.PORT || 8001;
const BASE = '/api';

const tokens = new Set();
let tokenCounter = 0;
const users = [
  { id: 1, name: 'Michael Chen', email: 'michael@titans.media', password: 'password123', created_at: '2026-01-15T10:00:00Z' }
];

const businessManagers = [
  { id: 1, name: 'Titans Media Global', business_id: '123456789012345', verified: true, balance: 45280.50, currency: 'USD', overdue: 0, ad_account_count: 12, page_count: 8, user_count: 24, created_at: '2026-01-20T08:00:00Z', updated_at: '2026-07-14T10:00:00Z' },
  { id: 2, name: 'Pulse Advertising EU', business_id: '987654321098765', verified: true, balance: 12450.00, currency: 'EUR', overdue: 2300.00, ad_account_count: 7, page_count: 15, user_count: 18, created_at: '2026-02-10T12:00:00Z', updated_at: '2026-07-13T14:30:00Z' },
  { id: 3, name: 'Nova Media Group', business_id: '456789012345678', verified: false, balance: 3200.75, currency: 'USD', overdue: 0, ad_account_count: 3, page_count: 5, user_count: 9, created_at: '2026-03-05T09:00:00Z', updated_at: '2026-07-12T16:45:00Z' },
  { id: 4, name: 'Vertex Brand Solutions', business_id: '321098765432109', verified: true, balance: 18920.30, currency: 'USD', overdue: 0, ad_account_count: 9, page_count: 12, user_count: 31, created_at: '2026-01-28T11:00:00Z', updated_at: '2026-07-14T09:15:00Z' },
  { id: 5, name: 'Atlas Digital Asia', business_id: '567890123456789', verified: false, balance: 890.00, currency: 'USD', overdue: 450.00, ad_account_count: 2, page_count: 4, user_count: 6, created_at: '2026-04-18T07:00:00Z', updated_at: '2026-07-11T11:20:00Z' },
  { id: 6, name: 'Crest Media Australia', business_id: '210987654321098', verified: true, balance: 7610.40, currency: 'AUD', overdue: 0, ad_account_count: 5, page_count: 7, user_count: 14, created_at: '2026-02-22T14:00:00Z', updated_at: '2026-07-13T08:00:00Z' },
];

// --- AD ACCOUNTS ---
// Store originals for hourly reset
const initialAdAccounts = {
  1: [
    { id: 1, account_id: 'act_123456', name: 'Titans Global Display', status: 'active', spend: 18450.00, currency: 'USD', impressions: 2450000, clicks: 48200, fb_ad_account_id: 'act_123456', created_at: '2026-01-25T10:00:00Z' },
    { id: 2, account_id: 'act_234567', name: 'Titans Social Pro', status: 'active', spend: 12380.00, currency: 'USD', impressions: 1890000, clicks: 35100, fb_ad_account_id: 'act_234567', created_at: '2026-02-01T11:00:00Z' },
    { id: 3, account_id: 'act_345678', name: 'Titans Retargeting', status: 'active', spend: 8950.00, currency: 'USD', impressions: 980000, clicks: 21400, fb_ad_account_id: 'act_345678', created_at: '2026-02-15T09:00:00Z' },
    { id: 4, account_id: 'act_456789', name: 'Titans Video Ads', status: 'disabled', spend: 0, currency: 'USD', impressions: 0, clicks: 0, fb_ad_account_id: null, created_at: '2026-03-01T08:00:00Z' },
    { id: 5, account_id: 'act_567890', name: 'Titans Lead Gen', status: 'active', spend: 6500.00, currency: 'USD', impressions: 720000, clicks: 12800, fb_ad_account_id: 'act_567890', created_at: '2026-03-10T14:00:00Z' },
    { id: 6, account_id: 'act_678901', name: 'Titans DPA Catalog', status: 'active', spend: 4200.00, currency: 'USD', impressions: 510000, clicks: 8900, fb_ad_account_id: 'act_678901', created_at: '2026-04-05T10:00:00Z' },
    { id: 7, account_id: 'act_789012', name: 'Titans App Installs', status: 'disabled', spend: 0, currency: 'USD', impressions: 0, clicks: 0, fb_ad_account_id: null, created_at: '2026-04-20T12:00:00Z' },
    { id: 8, account_id: 'act_890123', name: 'Titans Brand Awareness', status: 'active', spend: 3100.00, currency: 'USD', impressions: 410000, clicks: 6200, fb_ad_account_id: 'act_890123', created_at: '2026-05-01T09:00:00Z' },
  ],
};

// Deep copy for the mutable version
const adAccounts = JSON.parse(JSON.stringify(initialAdAccounts));

// --- FACEBOOK PAGES ---
const initialFacebookPages = {
  1: [
    { id: 1, page_id: 'page_001', name: 'Titans Media Global', category: 'Media & News', followers: 284000, engaged: 12400, status: 'published', token: '', useragent: '', proxy: '', group_name: '', cookie: '', notify_balance_threshold: 0, notify_cooldown_minutes: 60, notify_moderation: true, notify_cabinet_status: true, notify_billing: true, created_at: '2026-01-22T08:00:00Z' },
    { id: 2, page_id: 'page_002', name: 'Titans Insights', category: 'Consulting', followers: 89000, engaged: 4300, status: 'published', token: '', useragent: '', proxy: '', group_name: '', cookie: '', notify_balance_threshold: 0, notify_cooldown_minutes: 60, notify_moderation: true, notify_cabinet_status: true, notify_billing: true, created_at: '2026-02-05T09:00:00Z' },
    { id: 3, page_id: 'page_003', name: 'Titans Careers', category: 'Recruiting', followers: 45000, engaged: 2100, status: 'published', token: '', useragent: '', proxy: '', group_name: '', cookie: '', notify_balance_threshold: 0, notify_cooldown_minutes: 60, notify_moderation: true, notify_cabinet_status: true, notify_billing: true, created_at: '2026-02-18T10:00:00Z' },
    { id: 4, page_id: 'page_004', name: 'Titans Community', category: 'Community', followers: 32000, engaged: 1800, status: 'unpublished', token: '', useragent: '', proxy: '', group_name: '', cookie: '', notify_balance_threshold: 0, notify_cooldown_minutes: 60, notify_moderation: true, notify_cabinet_status: true, notify_billing: true, created_at: '2026-03-01T11:00:00Z' },
  ],
};

const facebookPages = JSON.parse(JSON.stringify(initialFacebookPages));

const teamMembers = {
  1: [
    { id: 1, name: 'Michael Chen', email: 'michael@titans.media', role: 'Admin', status: 'active', last_active: '2026-07-14T09:23:00Z', created_at: '2026-01-15T10:00:00Z' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@titans.media', role: 'Ad Manager', status: 'active', last_active: '2026-07-14T08:15:00Z', created_at: '2026-01-20T10:00:00Z' },
    { id: 3, name: 'James Rodriguez', email: 'james@titans.media', role: 'Analyst', status: 'active', last_active: '2026-07-13T16:42:00Z', created_at: '2026-02-10T10:00:00Z' },
    { id: 4, name: 'Emily Park', email: 'emily@titans.media', role: 'Ad Manager', status: 'disabled', last_active: '2026-07-10T11:30:00Z', created_at: '2026-03-05T10:00:00Z' },
    { id: 5, name: 'David Kim', email: 'david@titans.media', role: 'Viewer', status: 'active', last_active: '2026-07-13T14:05:00Z', created_at: '2026-04-01T10:00:00Z' },
  ],
};

// --- DYNAMIC DATA ENGINE ---
// Every 90 seconds, decrease each active account's spend by $1
// Every hour on the hour, reset all ad/spend data to initial values

function resetAdData() {
  for (const bmId in initialAdAccounts) {
    adAccounts[bmId] = JSON.parse(JSON.stringify(initialAdAccounts[bmId]));
  }
  for (const bmId in initialFacebookPages) {
    facebookPages[bmId] = JSON.parse(JSON.stringify(initialFacebookPages[bmId]));
  }
}

function tickDecrease() {
  for (const bmId in adAccounts) {
    for (const acct of adAccounts[bmId]) {
      if (acct.status === 'active' && acct.spend > 0) {
        acct.spend = Math.max(0, acct.spend - 1);
        // Also reduce impressions/clicks proportionally
        const avgCpm = acct.impressions > 0 ? (acct.spend / acct.impressions * 1000) : 0;
        if (avgCpm > 0) {
          const newImpressions = Math.max(0, Math.round(acct.spend / avgCpm * 1000));
          const ctr = acct.clicks > 0 && acct.impressions > 0 ? acct.clicks / acct.impressions : 0;
          acct.impressions = newImpressions;
          acct.clicks = Math.round(newImpressions * ctr);
        }
      }
    }
  }
  // Also update BM balances
  for (const bm of businessManagers) {
    const bmAccounts = adAccounts[bm.id] || [];
    const totalSpend = bmAccounts.reduce((sum, a) => sum + a.spend, 0);
    bm.balance = Math.max(0, (bm.balance || 0) - 1);
  }
}

// Schedule: decrease every 90 seconds
const DECREASE_INTERVAL_MS = 90 * 1000;
// Reset on the hour
function scheduleHourlyReset() {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  const msUntilNextHour = nextHour.getTime() - now.getTime();
  setTimeout(() => {
    resetAdData();
    // Re-schedule for the next hour
    scheduleHourlyReset();
  }, msUntilNextHour);
}

setInterval(tickDecrease, DECREASE_INTERVAL_MS);
scheduleHourlyReset();

// --- HTTP SERVER ---
function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function getToken(req) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return tokens.has(token) ? token : null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    });
    return res.end();
  }

  // Auth: Register
  if (method === 'POST' && path === `${BASE}/auth/register`) {
    const body = await getBody(req);
    const user = { id: users.length + 1, name: body.name, email: body.email, password: body.password, created_at: new Date().toISOString() };
    users.push(user);
    const token = `tok_${++tokenCounter}`;
    tokens.add(token);
    return json(res, 201, { message: 'User registered successfully.', access_token: token, token_type: 'Bearer', user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at } });
  }

  // Auth: Login
  if (method === 'POST' && path === `${BASE}/auth/login`) {
    const body = await getBody(req);
    const user = users.find(u => u.email === body.email && u.password === body.password);
    if (!user) return json(res, 422, { message: 'The provided credentials do not match our records.', errors: { email: ['Invalid credentials'] } });
    const token = `tok_${++tokenCounter}`;
    tokens.add(token);
    return json(res, 200, { message: 'Login successful.', access_token: token, token_type: 'Bearer', user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at } });
  }

  // Auth: Me
  if (method === 'GET' && path === `${BASE}/auth/me`) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const user = users[0];
    return json(res, 200, { user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at } });
  }

  // Auth: Logout
  if (method === 'POST' && path === `${BASE}/auth/logout`) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    tokens.delete(token);
    return json(res, 200, { message: 'Logged out successfully.' });
  }

  // BM: List
  if (method === 'GET' && path === `${BASE}/business-managers`) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = 20;
    const start = (page - 1) * perPage;
    const items = businessManagers.slice(start, start + perPage);
    return json(res, 200, {
      data: items,
      meta: { current_page: page, per_page: perPage, total: businessManagers.length, last_page: Math.ceil(businessManagers.length / perPage) },
    });
  }

  // BM: Show
  const bmShowMatch = path.match(/^\/api\/business-managers\/(\d+)$/);
  if (method === 'GET' && bmShowMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bm = businessManagers.find(b => b.id === parseInt(bmShowMatch[1]));
    if (!bm) return json(res, 404, { message: 'Not found.' });
    return json(res, 200, { data: bm });
  }

  // BM: Facebook Accounts (redirect to pages for backwards compat)
  const faMatch = path.match(/^\/api\/business-managers\/(\d+)\/facebook-accounts$/);
  if (method === 'GET' && faMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bmId = parseInt(faMatch[1]);
    const pages = facebookPages[bmId] || [];
    return json(res, 200, { data: pages });
  }

  // BM: Ad Accounts (GET)
  const aaMatch = path.match(/^\/api\/business-managers\/(\d+)\/ad-accounts$/);
  if (method === 'GET' && aaMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const accounts = adAccounts[parseInt(aaMatch[1])] || [];
    return json(res, 200, { data: accounts });
  }

  // BM: Ad Accounts (POST - create)
  if (method === 'POST' && aaMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bmId = parseInt(aaMatch[1]);
    const body = await getBody(req);
    if (!adAccounts[bmId]) adAccounts[bmId] = [];
    const newAccount = {
      id: Date.now(),
      account_id: body.account_id || `act_${Math.random().toString(36).slice(2, 8)}`,
      name: body.name,
      status: body.status || 'active',
      spend: 0,
      currency: 'USD',
      impressions: 0,
      clicks: 0,
      fb_ad_account_id: body.fb_ad_account_id || null,
      created_at: new Date().toISOString(),
    };
    adAccounts[bmId].unshift(newAccount);
    return json(res, 201, { data: newAccount, message: 'Ad account created.' });
  }

  // BM: Ad Accounts (PUT - update)
  const aaUpdateMatch = path.match(/^\/api\/business-managers\/(\d+)\/ad-accounts\/(\d+)$/);
  if (method === 'PUT' && aaUpdateMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bmId = parseInt(aaUpdateMatch[1]);
    const aaId = parseInt(aaUpdateMatch[2]);
    const body = await getBody(req);
    const accounts = adAccounts[bmId];
    if (!accounts) return json(res, 404, { message: 'Not found.' });
    const acct = accounts.find(a => a.id === aaId);
    if (!acct) return json(res, 404, { message: 'Not found.' });
    Object.assign(acct, body, { id: aaId });
    return json(res, 200, { data: acct });
  }

  // BM: Pages (GET)
  const pgMatch = path.match(/^\/api\/business-managers\/(\d+)\/pages$/);
  if (method === 'GET' && pgMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const pages = facebookPages[parseInt(pgMatch[1])] || [];
    return json(res, 200, { data: pages });
  }

  // BM: Pages (POST - create)
  if (method === 'POST' && pgMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bmId = parseInt(pgMatch[1]);
    const body = await getBody(req);
    if (!facebookPages[bmId]) facebookPages[bmId] = [];
    const newPage = {
      id: Date.now(),
      page_id: body.page_id || `page_${Math.random().toString(36).slice(2, 8)}`,
      name: body.name,
      category: body.category || '',
      followers: body.followers || 0,
      engaged: body.engaged || 0,
      status: 'published',
      token: body.token || '',
      useragent: body.useragent || '',
      proxy: body.proxy || '',
      group_name: body.group_name || '',
      cookie: body.cookie || '',
      notify_balance_threshold: body.notify_balance_threshold ?? 0,
      notify_cooldown_minutes: body.notify_cooldown_minutes ?? 60,
      notify_moderation: body.notify_moderation ?? true,
      notify_cabinet_status: body.notify_cabinet_status ?? true,
      notify_billing: body.notify_billing ?? true,
      created_at: new Date().toISOString(),
    };
    facebookPages[bmId].unshift(newPage);
    return json(res, 201, { data: newPage, message: 'Facebook page created.' });
  }

  // BM: Pages (PUT - update)
  const pgUpdateMatch = path.match(/^\/api\/business-managers\/(\d+)\/pages\/(\d+)$/);
  if (method === 'PUT' && pgUpdateMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bmId = parseInt(pgUpdateMatch[1]);
    const pgId = parseInt(pgUpdateMatch[2]);
    const body = await getBody(req);
    const pages = facebookPages[bmId];
    if (!pages) return json(res, 404, { message: 'Not found.' });
    const page = pages.find(p => p.id === pgId);
    if (!page) return json(res, 404, { message: 'Not found.' });
    Object.assign(page, body, { id: pgId });
    return json(res, 200, { data: page });
  }

  // BM: Pages (DELETE)
  if (method === 'DELETE' && pgUpdateMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bmId = parseInt(pgUpdateMatch[1]);
    const pgId = parseInt(pgUpdateMatch[2]);
    const pages = facebookPages[bmId];
    if (pages) {
      const idx = pages.findIndex(p => p.id === pgId);
      if (idx !== -1) pages.splice(idx, 1);
    }
    return json(res, 200, { message: 'Facebook page deleted.' });
  }

  // BM: Members
  const mbMatch = path.match(/^\/api\/business-managers\/(\d+)\/members$/);
  if (method === 'GET' && mbMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const members = teamMembers[parseInt(mbMatch[1])] || [];
    return json(res, 200, { data: members });
  }

  // BM: Invite Member
  const invMatch = path.match(/^\/api\/business-managers\/(\d+)\/members\/invite$/);
  if (method === 'POST' && invMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const body = await getBody(req);
    const bmId = parseInt(invMatch[1]);
    if (!teamMembers[bmId]) teamMembers[bmId] = [];
    const nameFormatted = body.email.split('@')[0].replace(/[.\-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const newMember = { id: Date.now(), name: nameFormatted, email: body.email, role: body.role || 'Analyst', status: 'active', last_active: new Date().toISOString(), created_at: new Date().toISOString() };
    teamMembers[bmId].unshift(newMember);
    return json(res, 201, { message: 'Invitation sent successfully.', member: newMember });
  }

  // BM: Update Member Role
  const roleMatch = path.match(/^\/api\/business-managers\/(\d+)\/members\/(\d+)\/role$/);
  if (method === 'PUT' && roleMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const body = await getBody(req);
    const bmId = parseInt(roleMatch[1]);
    const memberId = parseInt(roleMatch[2]);
    const members = teamMembers[bmId];
    if (!members) return json(res, 404, { message: 'Not found.' });
    const member = members.find(m => m.id === memberId);
    if (!member) return json(res, 404, { message: 'Not found.' });
    member.role = body.role;
    return json(res, 200, { data: member });
  }

  // BM: Delete Member
  const delMatch = path.match(/^\/api\/business-managers\/(\d+)\/members\/(\d+)$/);
  if (method === 'DELETE' && delMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const bmId = parseInt(delMatch[1]);
    const memberId = parseInt(delMatch[2]);
    const members = teamMembers[bmId];
    if (members) {
      const idx = members.findIndex(m => m.id === memberId);
      if (idx !== -1) members.splice(idx, 1);
    }
    return json(res, 200, { message: 'Team member removed.' });
  }

  // Billing: GET /api/ad-accounts/{id}/billing
  const billingMatch = path.match(/^\/api\/ad-accounts\/(\d+)\/billing$/);
  if (method === 'GET' && billingMatch) {
    const token = getToken(req);
    if (!token) return json(res, 401, { message: 'Unauthenticated.' });
    const aaId = parseInt(billingMatch[1]);
    let found = null;
    for (const bmId in adAccounts) {
      const acct = adAccounts[bmId].find(a => a.id === aaId);
      if (acct) { found = acct; break; }
    }
    if (!found) return json(res, 404, { message: 'Not found.' });
    return json(res, 200, {
      id: found.id,
      ad_account_id: found.account_id,
      name: found.name,
      facebook: {
        balance: found.spend > 5000 ? 25000 : 8500,
        spend: found.spend,
        amount_spent: found.spend * 1.12,
        account_status: found.status === 'active' ? 1 : 3,
        currency: found.currency || 'USD',
        business_name: 'Titans Media',
        spend_cap: 100000,
        budget_remaining: 100000 - found.spend,
        daily_spend: Math.round(found.spend / 30),
        min_campaign_group_spend_cap: 100,
        disable_reason: found.status === 'disabled' ? 'USER_DISABLED_ACCOUNT' : null,
      },
      local: {
        spend: found.spend,
        impressions: found.impressions || 0,
        clicks: found.clicks || 0,
        currency: found.currency || 'USD',
      },
    });
  }

  json(res, 404, { message: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`\n  🚀 Mock API server running at http://localhost:${PORT}`);
  console.log(`  📋 Login: michael@titans.media / password123`);
  console.log(`  📊 Dynamic data: spend decreases by $1 every 90s, resets on the hour\n`);
});
