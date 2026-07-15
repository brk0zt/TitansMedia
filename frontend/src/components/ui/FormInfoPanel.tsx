import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

export function FormInfoPanel() {
  const [open, setOpen] = useState(true);
  const [cookieOpen, setCookieOpen] = useState(true);
  const [cookieSelectOpen, setCookieSelectOpen] = useState(true);

  return (
    <div className="w-full sm:w-96 flex-shrink-0 bg-black/50 border border-white/[0.06] rounded-xl h-fit sm:sticky sm:top-6 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.02] transition-default"
      >
        <span className="text-xs font-semibold text-white/60 tracking-wide uppercase">
          Token Selection Guide
        </span>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
        )}
      </button>

      {open && (
        <div className="overflow-y-auto max-h-[400px] p-4 space-y-4">
          <p className="text-[11px] text-white/35 leading-relaxed">
            Choosing the correct Meta Access Token type depends strictly on the endpoints you need to access <strong className="text-white/60">(Ads vs. Pages)</strong> and your environment <strong className="text-white/60">(Development vs. Production)</strong>.
          </p>

          <div className="space-y-3">
            <div className="bg-white/[0.03] rounded-lg p-3 space-y-1.5 border-l-2 border-amber-500/50">
              <p className="text-xs font-semibold text-amber-400/90">1. User Access Token</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Best Used For</p>
              <p className="text-[11px] text-white/50">Development, testing, prototyping, and personal scripts.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Scope of Access</p>
              <p className="text-[11px] text-white/50">Provides access to all Ad Accounts, Business Portfolios, and Facebook Pages that the authenticated Facebook user manages.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Capabilities</p>
              <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-0.5">
                <li>Fetching ad account balances, transaction histories, and billing settings (ads_read).</li>
                <li>Creating custom audiences and scaling campaigns (ads_management).</li>
                <li>Listing all managed pages under the user profile.</li>
              </ul>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Lifespan</p>
              <p className="text-[11px] text-white/50">Short-lived (expires in 1-2 hours when generated from Graph API Explorer). Can be exchanged for a long-lived user token (expires in 60 days).</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Verdict</p>
              <p className="text-[11px] text-white/60">Mandatory for managing core Ad Account financial data, pixels, and broad multi-page campaign setups during development.</p>
            </div>

            <div className="bg-white/[0.03] rounded-lg p-3 space-y-1.5 border-l-2 border-sky-500/50">
              <p className="text-xs font-semibold text-sky-400/90">2. Page Access Token</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Best Used For</p>
              <p className="text-[11px] text-white/50">Page-specific automation, chatbots, and localized organic content management.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Scope of Access</p>
              <p className="text-[11px] text-white/50">Isolated strictly to a single Facebook Page selected from the dropdown menu.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Capabilities</p>
              <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-0.5">
                <li>Reading page interactions, posts, reviews, and private messages.</li>
                <li>Accessing Lead Generation Form data (Leads API).</li>
                <li>Reading limited ad data triggered only from within the page itself (e.g., Boosted Posts via pages_manage_ads).</li>
              </ul>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Limitations</p>
              <p className="text-[11px] text-white/50">Cannot access global Ad Account metrics, financial billing histories, payment methods, or pixel structures.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Lifespan</p>
              <p className="text-[11px] text-white/50">Can be converted into a permanent (never-expiring) token for continuous server-side page management.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Verdict</p>
              <p className="text-[11px] text-white/60">Do not use if your goal is to track main ad account balances or manage complex Ads Manager structures.</p>
            </div>

            <div className="bg-white/[0.03] rounded-lg p-3 space-y-1.5 border-l-2 border-emerald-500/50">
              <p className="text-xs font-semibold text-emerald-400/90">3. System User Access Token</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Best Used For</p>
              <p className="text-[11px] text-white/50">Production environments, live SaaS applications, continuous CRMs, and 24/7 background automation servers.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Scope of Access</p>
              <p className="text-[11px] text-white/50">Accesses assets (Ad Accounts, Pixels, Pages) explicitly assigned to the System User inside the Meta Business Suite.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Capabilities</p>
              <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-0.5">
                <li>Same robust capabilities as the User Access Token regarding ads_management and ads_read.</li>
                <li>Monitors ad spending limits, processes automated bidding, and triggers financial reporting.</li>
              </ul>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Lifespan</p>
              <p className="text-[11px] text-white/50">Permanent (Never Expires). It remains valid until manually revoked or if passwords change.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Verdict</p>
              <p className="text-[11px] text-white/60">The industry-standard choice for running background scripts that alert you when ad balances run low, without risking downtime due to token expiration.</p>
            </div>
          </div>

          <a
            href="https://developers.facebook.com/tools/explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/60 transition-default pt-2 border-t border-white/[0.06]"
          >
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
            Open Graph API Explorer
          </a>
        </div>
      )}

      {/* Cookie Selection Guide */}
      <button
        onClick={() => setCookieSelectOpen(!cookieSelectOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.02] transition-default"
      >
        <span className="text-xs font-semibold text-white/60 tracking-wide uppercase">
          Cookie Selection Guide
        </span>
        {cookieSelectOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
        )}
      </button>

      {cookieSelectOpen && (
        <div className="overflow-y-auto max-h-[400px] p-4 space-y-4">
          <p className="text-[11px] text-white/35 leading-relaxed">
            Cookie-based automation relies on Facebook session cookies. Choose the input method that matches how you extracted the cookies.
          </p>

          <div className="space-y-3">
            <div className="bg-white/[0.03] rounded-lg p-3 space-y-1.5 border-l-2 border-rose-500/50">
              <p className="text-xs font-semibold text-rose-400/90">1. Structured Cookie Fields (Recommended)</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Best Used For</p>
              <p className="text-[11px] text-white/50">When you can copy individual cookie values from browser DevTools.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Required Fields</p>
              <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-0.5">
                <li><strong className="text-white/70">c_user</strong> — Facebook user ID (numeric)</li>
                <li><strong className="text-white/70">xs</strong> — Session secret token (most critical)</li>
                <li><strong className="text-white/70">datr</strong> — Cross-site request forgery protection cookie</li>
              </ul>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Optional Fields</p>
              <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-0.5">
                <li><strong className="text-white/70">sb</strong> — Session backup cookie</li>
                <li><strong className="text-white/70">fr</strong> — Facebook advertising cookie</li>
              </ul>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">How to Extract</p>
              <ol className="text-[11px] text-white/50 list-decimal pl-4 space-y-0.5">
                <li>Log in to <strong className="text-white/60">facebook.com</strong></li>
                <li>Open DevTools <strong className="text-white/60">(F12)</strong> → Application → Cookies → <code className="text-white/40 bg-white/[0.05] px-1 rounded">https://facebook.com</code></li>
                <li>Copy each value into the corresponding field</li>
              </ol>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Verdict</p>
              <p className="text-[11px] text-white/60">Most reliable method — server validates each cookie individually and can detect missing critical cookies.</p>
            </div>

            <div className="bg-white/[0.03] rounded-lg p-3 space-y-1.5 border-l-2 border-sky-500/50">
              <p className="text-xs font-semibold text-sky-400/90">2. Raw Cookie String</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Best Used For</p>
              <p className="text-[11px] text-white/50">Quick paste when you have the full cookie header from browser DevTools Network tab.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Format</p>
              <p className="text-[11px] font-mono text-[10px] text-white/40 bg-white/[0.05] px-2 py-1 rounded">c_user=12345; xs=abc%3Adef; datr=xyz; sb=...</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">How to Extract</p>
              <ol className="text-[11px] text-white/50 list-decimal pl-4 space-y-0.5">
                <li>Open DevTools <strong className="text-white/60">(F12)</strong> → Network tab</li>
                <li>Refresh page, click any <code className="text-white/40 bg-white/[0.05] px-1 rounded">facebook.com</code> request</li>
                <li>Copy <strong className="text-white/60">Cookie</strong> header value from Request Headers</li>
                <li>Paste into the Raw Cookie textarea</li>
              </ol>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Verdict</p>
              <p className="text-[11px] text-white/60">Fastest for copy-paste; server parses automatically. Use if structured fields feel tedious.</p>
            </div>

            <div className="bg-white/[0.03] rounded-lg p-3 space-y-1.5 border-l-2 border-emerald-500/50">
              <p className="text-xs font-semibold text-emerald-400/90">3. Cookie File Import (Advanced)</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Best Used For</p>
              <p className="text-[11px] text-white/50">Teams managing multiple accounts; export/import JSON or Netscape format cookie files.</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Supported Formats</p>
              <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-0.5">
                <li><strong className="text-white/70">Netscape</strong> — <code className="text-white/40 bg-white/[0.05] px-1 rounded">.txt</code> (curl/wget compatible)</li>
                <li><strong className="text-white/70">JSON</strong> — <code className="text-white/40 bg-white/[0.05] px-1 rounded">.json</code> (Playwright/Puppeteer compatible)</li>
              </ul>
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Verdict</p>
              <p className="text-[11px] text-white/60">Best for scaling — import once, reuse across sessions. Requires file upload endpoint.</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-wide">Critical Cookies Priority</p>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded text-center">
                <p className="text-rose-400 font-semibold">c_user</p>
                <p className="text-white/40">REQUIRED</p>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded text-center">
                <p className="text-rose-400 font-semibold">xs</p>
                <p className="text-white/40">REQUIRED</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-center">
                <p className="text-amber-400 font-semibold">datr</p>
                <p className="text-white/40">HIGHLY RECOMMENDED</p>
              </div>
            </div>
          </div>

          <a
            href="https://developers.facebook.com/tools/explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/60 transition-default pt-2 border-t border-white/[0.06]"
          >
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
            Open Graph API Explorer
          </a>
        </div>
      )}

      {/* Cookie Automation Guide */}
      <button
        onClick={() => setCookieOpen(!cookieOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.02] transition-default"
      >
        <span className="text-xs font-semibold text-white/60 tracking-wide uppercase">
          Cookie Automation Guide
        </span>
        {cookieOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-white/40" strokeWidth={1.5} />
        )}
      </button>

      {cookieOpen && (
        <div className="overflow-y-auto max-h-[400px] p-4 space-y-4">
          <p className="text-[11px] text-white/35 leading-relaxed">
            Cookie-based automation uses Facebook session cookies to act as a logged-in browser, without requiring any API tokens or developer permissions.
          </p>

          <div className="bg-white/[0.03] rounded-lg p-3 space-y-1.5 border-l-2 border-rose-500/50">
            <p className="text-xs font-semibold text-rose-400/90">Required Cookies</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wide">How to Get Them</p>
            <ol className="text-[11px] text-white/50 list-decimal pl-4 space-y-0.5">
              <li>Log in to <strong className="text-white/60">facebook.com</strong> in your browser</li>
              <li>Open DevTools <strong className="text-white/60">(F12)</strong> → Application → Storage → Cookies</li>
              <li>Copy values for: <strong className="text-white/60">c_user</strong>, <strong className="text-white/60">xs</strong>, <strong className="text-white/60">datr</strong></li>
              <li>Optionally paste the full cookie string into the Raw field</li>
            </ol>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-wide">How It Works</p>
            <ul className="text-[11px] text-white/50 list-disc pl-4 space-y-0.5">
              <li>Cookies are sent to a headless browser (Playwright) on the server</li>
              <li>The browser impersonates the logged-in user and navigates Facebook pages</li>
              <li>Data is scraped or actions are performed as if the user were sitting at the keyboard</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-wide">Advantages</p>
            <ul className="text-[11px] text-emerald-400/70 list-disc pl-4 space-y-0.5">
              <li>No developer tokens, app reviews, or partner permissions needed</li>
              <li>Works with any Facebook account — no special setup</li>
              <li>Can perform actions the Graph API does not expose</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-wide">Risks</p>
            <ul className="text-[11px] text-rose-400/70 list-disc pl-4 space-y-0.5">
              <li>Ban risk — Meta detects automated browser activity</li>
              <li>Cookies expire (typically ~30 days) — re-authentication needed</li>
              <li>Security — cookies must be stored encrypted</li>
              <li>Requires unique fingerprints + proxies for each session</li>
            </ul>
          </div>

          <a
            href="https://developers.facebook.com/tools/explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/60 transition-default pt-2 border-t border-white/[0.06]"
          >
            <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
            Open Graph API Explorer
          </a>
        </div>
      )}
    </div>
  );
}