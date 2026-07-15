import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

export function FormInfoPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full sm:w-72 flex-shrink-0 bg-black/50 border border-white/[0.06] rounded-xl h-fit sm:sticky sm:top-6 overflow-hidden">
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
    </div>
  );
}
